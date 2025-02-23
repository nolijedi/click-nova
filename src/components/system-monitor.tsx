import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Cpu, HardDrive, Database, Network } from 'lucide-react';

interface SystemMetrics {
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
  Success: boolean;
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('http://localhost:3001/api/metrics');
        const data = await response.json();
        
        if (!data.Success) {
          throw new Error(data.error || 'Failed to fetch metrics');
        }
        
        if (!data.Memory?.Total) {
          throw new Error('Invalid metrics data');
        }

        setMetrics(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Connection error');
        setMetrics(null);
      }
    }

    // Initial fetch
    fetchMetrics();

    // Set up polling with longer interval on error
    const interval = setInterval(fetchMetrics, error ? 5000 : 2000);
    return () => clearInterval(interval);
  }, [error]);

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-2 text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!metrics || !metrics.Memory || !metrics.Memory.Total) {
    return (
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2 text-blue-400">
          Loading system metrics...
        </div>
      </div>
    );
  }

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
            <Progress value={(metrics.Network.Usage / 1000000) * 100} className="h-2" />
          </div>
          <div className="text-sm">{(metrics.Network.Usage / 1000000).toFixed(1)} MB/s</div>
        </div>
      </Card>
    </div>
  );
}
