const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
app.use(cors());

async function getMetric(counter) {
  try {
    const { stdout } = await execPromise(`powershell -Command "Get-Counter '${counter}' | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue"`);
    return parseFloat(stdout.trim());
  } catch (error) {
    console.error(`Error getting metric ${counter}:`, error);
    return 0;
  }
}

async function getMemoryTotal() {
  try {
    const { stdout } = await execPromise('powershell -Command "(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB"');
    return parseFloat(stdout.trim());
  } catch (error) {
    console.error('Error getting total memory:', error);
    return 16; // fallback to 16GB
  }
}

app.get('/api/metrics', async (req, res) => {
  try {
    const [cpu, memFree, diskTime, networkBytes, memTotal] = await Promise.all([
      getMetric('\\Processor(_Total)\\% Processor Time'),
      getMetric('\\Memory\\Available MBytes'),
      getMetric('\\PhysicalDisk(_Total)\\% Disk Time'),
      getMetric('\\Network Interface(*)\\Bytes Total/sec'),
      getMemoryTotal()
    ]);

    const metrics = {
      Success: true,
      CPU: Math.round(cpu * 100) / 100,
      Memory: {
        Total: Math.round(memTotal * 100) / 100,
        Free: Math.round(memFree / 1024 * 100) / 100
      },
      Disk: {
        Usage: Math.round(diskTime * 100) / 100
      },
      Network: {
        Usage: Math.round(networkBytes * 100) / 100
      }
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error in /api/metrics:', error);
    res.status(500).json({
      Success: false,
      error: 'Failed to get system metrics',
      details: error.message
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Try /api/test to verify server is working');
});
