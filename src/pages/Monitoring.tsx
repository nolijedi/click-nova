import { SystemMonitor } from '@/components/system-monitor';

export default function Monitoring() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        System Monitoring
      </h1>
      <SystemMonitor />
    </div>
  );
}
