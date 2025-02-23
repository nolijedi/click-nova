import { useEffect, useState, useCallback } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Cpu, HardDrive, Database, Network, Clock, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Process {
  name: string;
  cpu: number;
  memory: number;
  id: number;
}

interface SystemMetrics {
  CPU: number;
  Memory: {
    UsagePercent: number;
    TotalGB: number;
    UsedGB: number;
    FreeGB: number;
  };
  Disk: {
    Usage: number;
    Health: string;
    MediaType: string;
  };
  Network: {
    Usage: number;
    Speed: string;
    Status: string;
  };
  Processes: Process[];
  Uptime: number;
  Success: boolean;
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/system/metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      const data = await response.json();
      if (!data.Success) {
        throw new Error(data.Error || 'Unknown error');
      }
      setMetrics(data);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setError(error.message);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, retryCount > 3 ? 5000 : 2000);
    return () => clearInterval(interval);
  }, [fetchMetrics, retryCount]);

  const getProgressColor = (value: number): string => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  const getStatusText = (value: number): string => {
    if (value >= 90) return 'Critical';
    if (value >= 70) return 'High';
    if (value >= 50) return 'Moderate';
    return 'Normal';
  };

  const formatUptime = (hours: number): string => {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${remainingHours}h`;
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon,
    detail,
    subDetail,
    loading,
    error: cardError
  }: { 
    title: string; 
    value: number; 
    icon: React.ElementType;
    detail?: string;
    subDetail?: string;
    loading?: boolean;
    error?: string;
  }) => (
    <div className="relative p-4 rounded-lg bg-black/30 border border-cyan-500/20 backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full" />
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-medium text-cyan-100">{title}</h3>
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-2 w-full bg-cyan-950/50" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12 bg-cyan-950/50" />
            <Skeleton className="h-4 w-16 bg-cyan-950/50" />
          </div>
        </div>
      ) : cardError ? (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {cardError}
        </div>
      ) : (
        <div className="space-y-2">
          <Progress 
            value={value} 
            className={`h-2 bg-cyan-950 ${getProgressColor(value)}`}
          />
          <div className="flex justify-between text-sm">
            <span className="text-cyan-200">{Math.round(value)}%</span>
            <span className={`${value >= 90 ? 'text-red-400' : value >= 70 ? 'text-yellow-400' : 'text-cyan-400'}`}>
              {getStatusText(value)}
            </span>
          </div>
          {detail && (
            <div className="mt-2 text-xs text-cyan-300/70">
              {detail}
            </div>
          )}
          {subDetail && (
            <div className="mt-1 text-xs text-cyan-300/50">
              {subDetail}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (error && retryCount > 3) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-medium">Failed to fetch system metrics</p>
            <p className="text-sm text-red-400/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <MetricCard 
          title="CPU Usage" 
          value={metrics?.CPU ?? 0} 
          icon={Cpu} 
          loading={loading}
          error={error}
          detail={metrics?.Processes?.[0] ? 
            `Top Process: ${metrics.Processes[0].name} (${metrics.Processes[0].cpu.toFixed(1)}%)` : 
            undefined}
        />
        <MetricCard 
          title="Memory Usage" 
          value={metrics?.Memory?.UsagePercent ?? 0} 
          icon={Database} 
          loading={loading}
          error={error}
          detail={metrics?.Memory ? 
            `Used: ${metrics.Memory.UsedGB.toFixed(1)} GB of ${metrics.Memory.TotalGB.toFixed(1)} GB` :
            undefined}
          subDetail={metrics?.Memory ?
            `Free: ${metrics.Memory.FreeGB.toFixed(1)} GB` :
            undefined}
        />
        <MetricCard 
          title="Disk Activity" 
          value={metrics?.Disk?.Usage ?? 0} 
          icon={HardDrive} 
          loading={loading}
          error={error}
          detail={metrics?.Disk ? 
            `Type: ${metrics.Disk.MediaType} (${metrics.Disk.Health})` :
            undefined}
        />
        <MetricCard 
          title="Network Usage" 
          value={metrics?.Network?.Usage ?? 0} 
          icon={Network} 
          loading={loading}
          error={error}
          detail={metrics?.Network ? 
            `Speed: ${metrics.Network.Speed}` :
            undefined}
          subDetail={metrics?.Network ?
            `Status: ${metrics.Network.Status}` :
            undefined}
        />
      </div>

      {metrics?.Processes && (
        <div className="mt-4 p-4 rounded-lg bg-black/30 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-cyan-400">Top Processes</h4>
            {metrics.Uptime && (
              <div className="flex items-center gap-2 text-xs text-cyan-300/70">
                <Clock className="w-3 h-3" />
                Uptime: {formatUptime(metrics.Uptime)}
              </div>
            )}
          </div>
          <div className="space-y-2">
            {metrics.Processes.map((process, index) => (
              <div key={process.id} className="flex justify-between text-xs bg-black/20 p-2 rounded">
                <span className="text-cyan-200">{process.name}</span>
                <div className="flex gap-4">
                  <span className="text-cyan-400">CPU: {process.cpu.toFixed(1)}%</span>
                  <span className="text-cyan-400">Memory: {process.memory.toFixed(1)} MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
