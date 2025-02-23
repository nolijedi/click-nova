import express from 'express';
import cors from 'cors';
import { executeCommand } from '../src/api/system';

const app = express();
const port = process.env.OPTIMIZATION_SERVER_PORT || 3002;

app.use(cors());
app.use(express.json());

// Execute optimization commands
app.post('/api/optimize', async (req, res) => {
  try {
    const { command } = req.body;
    const output = await executeCommand(command);
    res.json({ output });
  } catch (error) {
    console.error('Error executing optimization command:', error);
    res.status(500).json({ error: 'Failed to execute optimization command' });
  }
});

// Get optimization status
app.get('/api/optimize/status', async (req, res) => {
  try {
    const status = {
      cpuOptimized: true,
      memoryOptimized: true,
      diskOptimized: true,
      lastOptimization: new Date().toISOString()
    };
    res.json(status);
  } catch (error) {
    console.error('Error getting optimization status:', error);
    res.status(500).json({ error: 'Failed to get optimization status' });
  }
});

app.listen(port, () => {
  console.log(`Optimization Server running at http://localhost:${port}`);
});
