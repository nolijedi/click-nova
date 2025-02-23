import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Cpu, HardDrive, Database, Network } from 'lucide-react';

interface SystemMetrics {
  Success: boolean;
  CPU: number;
  Memory: {
    Total: number;
    Free: number;
  };
  Disk: {
    Usage: number;
  };
  Network: {
    Usage: number;
  };
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    Success: true,
    CPU: 0,
    Memory: { Total: 8, Free: 4 },
    Disk: { Usage: 0 },
    Network: { Usage: 0 }
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch the runtime config first
        const configResponse = await fetch('/runtime-config.json');
        const config = await configResponse.json();
        
        // Use the backend URL from the config
        const response = await fetch(`${config.backendUrl}/api/metrics`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        // On error, keep using the last known good values
        console.error('Error fetching metrics:', err);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  // Calculate memory usage percentage
  const memoryUsed = metrics.Memory.Total - metrics.Memory.Free;
  const memoryUsagePercent = (memoryUsed / metrics.Memory.Total) * 100;

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Cpu className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium mb-1">CPU Usage</div>
            <Progress value={metrics.CPU} className="h-2" />
          </div>
          <div className="text-sm">{Math.round(metrics.CPU)}%</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Database className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium mb-1">Memory Usage</div>
            <Progress value={memoryUsagePercent} className="h-2" />
          </div>
          <div className="text-sm">{Math.round(memoryUsagePercent)}%</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <HardDrive className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium mb-1">Disk Activity</div>
            <Progress value={metrics.Disk.Usage} className="h-2" />
          </div>
          <div className="text-sm">{Math.round(metrics.Disk.Usage)}%</div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Network className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium mb-1">Network Activity</div>
            <Progress value={0} className="h-2" />
          </div>
          <div className="text-sm">N/A</div>
        </div>
      </Card>
    </div>
  );
}
