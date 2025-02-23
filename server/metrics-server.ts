import express from 'express';
import cors from 'cors';
import { getSystemMetrics } from '../src/api/system';

const app = express();
const port = process.env.METRICS_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// System metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    res.json(metrics);
  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({ error: 'Failed to get system metrics' });
  }
});

app.listen(port, () => {
  console.log(`Metrics Server running at http://localhost:${port}`);
});
