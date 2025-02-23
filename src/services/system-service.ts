import { toast } from "sonner";

const METRICS_URL = import.meta.env.VITE_METRICS_URL || 'http://localhost:3001';
const OPTIMIZATION_URL = import.meta.env.VITE_OPTIMIZATION_URL || 'http://localhost:3002';
const MONITORING_URL = import.meta.env.VITE_MONITORING_URL || 'http://localhost:3003';

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temperature: number;
  totalMemory: number;
  freeMemory: number;
  diskTotal: number;
  diskFree: number;
}

class SystemService {
  private ws: WebSocket | null = null;
  private metricsListeners: ((metrics: SystemMetrics) => void)[] = [];

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    this.ws = new WebSocket(`ws://${new URL(MONITORING_URL).host}`);

    this.ws.onmessage = (event) => {
      const metrics = JSON.parse(event.data);
      this.metricsListeners.forEach(listener => listener(metrics));
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connectWebSocket(), 1000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribeToMetrics(callback: (metrics: SystemMetrics) => void) {
    this.metricsListeners.push(callback);
    return () => {
      this.metricsListeners = this.metricsListeners.filter(cb => cb !== callback);
    };
  }

  private async executeCommand(command: string): Promise<string> {
    try {
      const response = await fetch(`${OPTIMIZATION_URL}/api/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.output;
    } catch (error) {
      console.error('Failed to execute command:', error);
      throw error;
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    try {
      const response = await fetch(`${METRICS_URL}/api/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get system metrics:', error);
      throw error;
    }
  }

  async getOptimizationStatus() {
    try {
      const response = await fetch(`${OPTIMIZATION_URL}/api/optimize/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get optimization status:', error);
      throw error;
    }
  }

  async getMonitoringHistory() {
    try {
      const response = await fetch(`${MONITORING_URL}/api/monitoring/history`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get monitoring history:', error);
      throw error;
    }
  }

  async optimizeSystem(steps: string[]): Promise<void> {
    for (const step of steps) {
      try {
        toast.info(`Running: ${step}`);
        await this.executeCommand(step);
        toast.success(`Completed: ${step}`);
      } catch (error) {
        toast.error(`Failed: ${step}`);
        throw error;
      }
    }
  }

  async cleanTempFiles(): Promise<void> {
    try {
      toast.info('Cleaning temporary files...');
      await this.executeCommand('Remove-Item -Path "$env:TEMP\\*" -Recurse -Force');
      toast.success('Temporary files cleaned successfully');
    } catch (error) {
      toast.error('Failed to clean temporary files');
      throw error;
    }
  }

  async checkDiskHealth(): Promise<void> {
    try {
      toast.info('Checking disk health...');
      await this.executeCommand('Get-PhysicalDisk | Get-StorageReliabilityCounter');
      toast.success('Disk health check completed');
    } catch (error) {
      toast.error('Failed to check disk health');
      throw error;
    }
  }

  async optimizeStartup(): Promise<void> {
    try {
      toast.info('Optimizing startup programs...');
      await this.executeCommand('Get-CimInstance Win32_StartupCommand | Select-Object Command,Location,User');
      toast.success('Startup optimization completed');
    } catch (error) {
      toast.error('Failed to optimize startup');
      throw error;
    }
  }

  async defragmentDisk(): Promise<void> {
    try {
      toast.info('Analyzing disk fragmentation...');
      await this.executeCommand('Optimize-Volume -DriveLetter C -Analyze -Verbose');
      toast.success('Disk analysis completed');
    } catch (error) {
      toast.error('Failed to analyze disk');
      throw error;
    }
  }
}

export const systemService = new SystemService();
