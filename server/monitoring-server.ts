import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';
import { getSystemMetrics } from '../src/api/system';

const app = express();
const port = process.env.MONITORING_SERVER_PORT || 3003;

app.use(cors());
app.use(express.json());

// Create WebSocket server for real-time monitoring
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected to monitoring server');

  // Send system metrics every second
  const interval = setInterval(async () => {
    try {
      const metrics = await getSystemMetrics();
      ws.send(JSON.stringify(metrics));
    } catch (error) {
      console.error('Error sending metrics:', error);
    }
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected from monitoring server');
  });
});

// HTTP endpoints for historical data
app.get('/api/monitoring/history', async (req, res) => {
  try {
    const history = {
      timestamps: [],
      cpuUsage: [],
      memoryUsage: [],
      diskUsage: []
    };
    res.json(history);
  } catch (error) {
    console.error('Error getting monitoring history:', error);
    res.status(500).json({ error: 'Failed to get monitoring history' });
  }
});

const server = app.listen(port, () => {
  console.log(`Monitoring Server running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
