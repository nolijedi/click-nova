const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// List of allowed PowerShell commands for security
const ALLOWED_COMMANDS = [
  'Get-Process',
  'Get-Counter',
  'Get-PhysicalDisk',
  'Get-CimInstance',
  'Get-Volume',
  'Optimize-Volume',
  'Remove-Item',
  'Get-StorageReliabilityCounter',
  'cleanmgr',
  'Start-Process'
];

function escapePowerShellCommand(command) {
  // Escape double quotes and wrap the entire command in double quotes
  return `"${command.replace(/"/g, '`"')}"`;
}

async function executeCommand(command) {
  try {
    // Special handling for cleanmgr.exe
    if (command.includes('cleanmgr.exe')) {
      const { stdout, stderr } = await execAsync('powershell -Command "Start-Process cleanmgr.exe -ArgumentList \'/sagerun:1\' -Wait -NoNewWindow"');
      if (stderr) throw new Error(stderr);
      return stdout;
    }

    // Security check: Only allow whitelisted commands
    if (!ALLOWED_COMMANDS.some(cmd => command.toLowerCase().startsWith(cmd.toLowerCase()))) {
      throw new Error('Command not allowed for security reasons');
    }

    const escapedCommand = escapePowerShellCommand(command);
    const { stdout, stderr } = await execAsync(`powershell -NoProfile -NonInteractive -Command ${escapedCommand}`);
    
    if (stderr) {
      console.error('Command error:', stderr);
      throw new Error(stderr);
    }
    return stdout.trim();
  } catch (error) {
    console.error('Failed to execute command:', error);
    throw error;
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
      const cpuResult = await executeCommand(cpuCommand);
      const cpuUsage = parseFloat(cpuResult) || 0;

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
      const memoryResult = await executeCommand(memoryCommand);
      const [usedMem, totalMem, memPercentage] = memoryResult.split('|').map(Number);

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
      const diskResult = await executeCommand(diskCommand);
      const [usedDisk, totalDisk, diskPercentage] = diskResult.split('|').map(Number);

      return {
        cpuUsage,
        memoryUsage: memPercentage,
        diskUsage: diskPercentage,
        temperature: 0, // Removed temperature as it's not reliably available
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
    const { command } = req.body;
    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }
    const result = await executeCommand(command);
    res.json({ output: result });
  } catch (error) {
    console.error('Command execution error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
