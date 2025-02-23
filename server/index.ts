import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8082'], // Allow both Vite and custom ports
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
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
  'Start-Process',
  'Get-WmiObject',
  'Measure-Object',
  'Select-Object',
  'Where-Object',
  'ForEach-Object',
  'Sort-Object',
  'Get-Service',
  'Set-Service',
  'ipconfig',
  'netsh',
  'Get-WindowsUpdate',
  'winget',
  'Update-Module',
  'Install-Module',
  'Checkpoint-Computer',
  'reg',
  'New-Item',
  'Copy-Item',
  'Get-StartupCommand',
  'Export-Csv',
  'Get-NetAdapter',
  'Set-NetAdapter',
  'shutdown',
  'Write-Output'
];

// Helper function to execute PowerShell commands
const executePowerShellCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if the command is allowed
    if (!ALLOWED_COMMANDS.some(cmd => command.startsWith(cmd))) {
      reject(new Error('Command not allowed'));
      return;
    }

    const ps = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command]);
    let output = '';
    let error = '';

    ps.stdout.on('data', (data) => {
      output += data.toString();
    });

    ps.stderr.on('data', (data) => {
      error += data.toString();
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Command failed'));
      } else {
        resolve(output);
      }
    });

    ps.on('error', (err) => {
      reject(err);
    });
  });
};

// Cache for system metrics to prevent rapid fluctuations
let metricsCache = {
  timestamp: 0,
  data: null as any,
  ttl: 1000 // 1 second TTL
};

// Helper function to get system metrics with caching
const getSystemMetrics = async () => {
  const now = Date.now();
  if (metricsCache.data && (now - metricsCache.timestamp) < metricsCache.ttl) {
    return metricsCache.data;
  }

  try {
    // CPU and Process Info
    const cpuCommand = `
      $ErrorActionPreference = "Stop"
      try {
        # Get CPU usage with multiple samples for accuracy
        $cpuSamples = 0..2 | ForEach-Object {
          (Get-Counter '\\Processor(_Total)\\% Processor Time' -ErrorAction Stop).CounterSamples.CookedValue
          Start-Sleep -Milliseconds 100
        }
        $avgCpu = ($cpuSamples | Measure-Object -Average).Average

        # Get top processes by CPU
        $processes = Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 | ForEach-Object {
          @{
            Name = $_.ProcessName
            CPU = [math]::Round(($_.CPU / $_.TotalProcessorTime.TotalSeconds), 2)
            Memory = [math]::Round($_.WorkingSet64 / 1MB, 2)
            Id = $_.Id
          }
        }

        # Get memory info
        $os = Get-CimInstance Win32_OperatingSystem
        $totalMemory = $os.TotalVisibleMemorySize / 1KB
        $freeMemory = $os.FreePhysicalMemory / 1KB
        $usedMemory = $totalMemory - $freeMemory
        $memoryUsage = [math]::Round(($usedMemory / $totalMemory) * 100, 2)

        # Get disk info
        $disk = Get-PhysicalDisk | Select-Object -First 1
        $diskCounter = Get-Counter "\\PhysicalDisk(_Total)\\% Disk Time" -ErrorAction Stop
        $diskUsage = $diskCounter.CounterSamples[0].CookedValue

        # Get network info
        $network = Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1
        $networkStats = $network | Get-NetAdapterStatistics
        $networkUsage = [math]::Round(($networkStats.ReceivedBytes + $networkStats.SentBytes) / 1GB * 100, 2)

        # Get system uptime
        $uptime = (Get-Date) - $os.LastBootUpTime
        $uptimeHours = [math]::Round($uptime.TotalHours, 1)

        # Return all metrics
        @{
          Success = $true
          CPU = [math]::Round($avgCpu, 2)
          Memory = @{
            UsagePercent = $memoryUsage
            TotalGB = [math]::Round($totalMemory / 1024, 2)
            UsedGB = [math]::Round($usedMemory / 1024, 2)
            FreeGB = [math]::Round($freeMemory / 1024, 2)
          }
          Disk = @{
            Usage = [math]::Round($diskUsage, 2)
            Health = $disk.HealthStatus
            MediaType = $disk.MediaType
          }
          Network = @{
            Usage = $networkUsage
            Speed = $network.LinkSpeed
            Status = $network.Status
          }
          Processes = $processes
          Uptime = $uptimeHours
        } | ConvertTo-Json -Depth 10
      }
      catch {
        @{
          Success = $false
          Error = $_.Exception.Message
        } | ConvertTo-Json
      }
    `;

    const result = await executePowerShellCommand(cpuCommand);
    const metrics = JSON.parse(result);

    if (!metrics.Success) {
      throw new Error(metrics.Error);
    }

    // Update cache
    metricsCache = {
      timestamp: now,
      data: metrics,
      ttl: 1000
    };

    return metrics;
  } catch (error) {
    console.error('Error collecting system metrics:', error);
    throw error;
  }
};

// API endpoint for system metrics
app.get('/api/system/metrics', async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error in metrics endpoint:', error);
    res.status(500).json({
      Success: false,
      Error: 'Failed to fetch system metrics',
      Details: error.message
    });
  }
});

// Execute command endpoint
app.post('/api/system/execute', async (req, res) => {
  try {
    const { command } = req.body;
    const output = await executePowerShellCommand(command);
    res.json({ output });
  } catch (error) {
    console.error('Error executing command:', error);
    res.status(500).json({ error: 'Failed to execute command' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
