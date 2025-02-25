const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// List of allowed PowerShell commands for security
const ALLOWED_COMMANDS = [
  'Get-Volume',
  'Optimize-Volume',
  'Get-ChildItem',
  'Remove-Item',
  'ipconfig',
  'cleanmgr',
  'Write-Output',
  'Write-Warning'
];

// Validate PowerShell command for security
function isCommandAllowed(command: string): boolean {
  return ALLOWED_COMMANDS.some(allowed => command.includes(allowed));
}

// Execute PowerShell command safely
async function executePowerShellCommand(command: string): Promise<{ stdout: string; stderr: string }> {
  try {
    // Create temp script with proper error handling
    const scriptContent = `
      $ErrorActionPreference = 'Stop'
      try {
        ${command}
      } catch {
        Write-Warning $_.Exception.Message
        exit 1
      }
    `;
    
    const scriptPath = path.join(os.tmpdir(), `script-${Date.now()}.ps1`);
    await fs.writeFile(scriptPath, scriptContent);

    // Execute with proper encoding and error handling
    const psCommand = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}" -OutputFormat Text`;
    
    return new Promise((resolve, reject) => {
      exec(psCommand, { maxBuffer: 1024 * 1024 }, async (error, stdout, stderr) => {
        // Clean up script
        try {
          await fs.unlink(scriptPath);
        } catch (e) {
          console.warn('Failed to clean up script file:', e);
        }

        if (error && error.code === 'ENOENT') {
          reject(new Error('PowerShell is not available'));
          return;
        }

        resolve({
          stdout: stdout || '',
          stderr: stderr || (error ? error.message : '')
        });
      });
    });
  } catch (error) {
    throw new Error(`Failed to execute PowerShell command: ${error.message}`);
  }
}

async function getSystemMetricsWithRetry(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Get CPU usage using performance counter with error handling
      const cpuCommand = `
        try {
          $cpu = (Get-Counter '\\Processor(_Total)\\% Processor Time' -ErrorAction Stop).CounterSamples.CookedValue
          Write-Output $cpu
        } catch {
          Write-Output "0"
        }
      `;
      const cpuResult = await executePowerShellCommand(cpuCommand);
      const cpuUsage = parseFloat(cpuResult.stdout) || 0;

      // Get memory usage with error handling
      const memoryCommand = `
        try {
          $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
          $total = $os.TotalVisibleMemorySize * 1KB
          $free = $os.FreePhysicalMemory * 1KB
          $used = $total - $free
          $percentage = [math]::Round(($used / $total) * 100, 2)
          Write-Output "$used|$total|$percentage"
        } catch {
          Write-Output "0|0|0"
        }
      `;
      const memoryResult = await executePowerShellCommand(memoryCommand);
      const [usedMem, totalMem, memPercentage] = memoryResult.stdout.split('|').map(Number);

      // Get disk usage with error handling
      const diskCommand = `
        try {
          $disk = Get-Volume C -ErrorAction Stop
          $used = $disk.Size - $disk.SizeRemaining
          $total = $disk.Size
          $percentage = [math]::Round(($used / $total) * 100, 2)
          Write-Output "$used|$total|$percentage"
        } catch {
          Write-Output "0|0|0"
        }
      `;
      const diskResult = await executePowerShellCommand(diskCommand);
      const [usedDisk, totalDisk, diskPercentage] = diskResult.stdout.split('|').map(Number);

      return {
        cpuUsage,
        memoryUsage: memPercentage,
        diskUsage: diskPercentage,
        temperature: 0,
        totalMemory: totalMem,
        freeMemory: totalMem - usedMem,
        diskTotal: totalDisk,
        diskFree: totalDisk - usedDisk
      };
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Failed to get system metrics after retries');
}

app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await getSystemMetricsWithRetry();
    res.json(metrics);
  } catch (error) {
    console.error('Failed to get system metrics:', error);
    res.status(500).json({ error: 'Failed to get system metrics' });
  }
});

app.post('/api/execute', async (req, res) => {
  try {
    const { command, type } = req.body;
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }
    if (type === 'powershell') {
      const result = await executePowerShellCommand(command);
      res.json({ output: result.stdout, error: result.stderr });
    } else {
      const execAsync = promisify(exec);
      const result = await execAsync(command);
      res.json({ output: result.stdout });
    }
  } catch (error) {
    console.error('Command execution error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Execute system command endpoint
app.post('/api/system/execute', async (req, res) => {
  try {
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Validate command for security
    if (!isCommandAllowed(command)) {
      return res.status(403).json({ error: 'Command not allowed' });
    }

    const result = await executePowerShellCommand(command);
    res.json({
      output: result.stdout,
      error: result.stderr
    });
  } catch (error) {
    console.error('[Error] Command execution failed:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}...`);
});
