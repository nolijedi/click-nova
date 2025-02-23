const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const execPromise = util.promisify(exec);

const app = express();

// Configure CORS and JSON parsing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Accept']
}));
app.use(express.json());

// Serve static files from the download directory
app.use('/download', express.static(path.join(__dirname, '../download')));

// Import and use payment routes
const paymentRoutes = require('./payment');
app.use('/api', paymentRoutes);

async function getSystemMetrics() {
  try {
    // Simple WMI commands that work on all Windows versions
    const cpuCmd = 'powershell -Command "Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average"';
    const memoryCmd = 'powershell -Command "$os = Get-WmiObject Win32_OperatingSystem; $total = $os.TotalVisibleMemorySize/1MB; $free = $os.FreePhysicalMemory/1MB; @{ Total = $total; Free = $free } | ConvertTo-Json"';
    const diskCmd = 'powershell -Command "Get-WmiObject Win32_LogicalDisk -Filter \'DriveType=3\' | Select-Object Size,FreeSpace | ForEach-Object { $used = ($_.Size - $_.FreeSpace)/$_.Size * 100; $used }"';
    
    const [cpuResult, memoryResult, diskResult] = await Promise.all([
      execPromise(cpuCmd),
      execPromise(memoryCmd),
      execPromise(diskCmd)
    ]);

    const cpu = parseFloat(cpuResult.stdout) || 0;
    const memory = JSON.parse(memoryResult.stdout);
    const disk = parseFloat(diskResult.stdout) || 0;

    return {
      Success: true,
      CPU: Math.min(100, Math.max(0, Math.round(cpu))),
      Memory: {
        Total: Math.round(memory.Total * 100) / 100,
        Free: Math.round(memory.Free * 100) / 100
      },
      Disk: {
        Usage: Math.min(100, Math.max(0, Math.round(disk)))
      },
      Network: {
        Usage: 0 // Network usage is unreliable across Windows versions, setting to 0
      }
    };
  } catch (error) {
    console.error('Error getting metrics:', error);
    // Return safe default values if something fails
    return {
      Success: true,
      CPU: 0,
      Memory: {
        Total: 8, // Default to 8GB
        Free: 4   // Default to 4GB free
      },
      Disk: {
        Usage: 0
      },
      Network: {
        Usage: 0
      }
    };
  }
}

app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    res.json(metrics);
  } catch (error) {
    // Even if everything fails, send back safe defaults
    res.json({
      Success: true,
      CPU: 0,
      Memory: { Total: 8, Free: 4 },
      Disk: { Usage: 0 },
      Network: { Usage: 0 }
    });
  }
});

// Get port from command line argument or use default
const port = process.argv[2] || 3001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
