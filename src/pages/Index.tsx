
import { Cpu, HardDrive, MonitorSmartphone as Gpu, Memory as Ram } from "lucide-react";
import MetricCard from "@/components/ui/metric-card";
import PerformanceChart from "@/components/ui/performance-chart";
import { OptimizeButton } from "@/components/optimize-button";

const mockPerformanceData = [
  { timestamp: "00:00", value: 45 },
  { timestamp: "01:00", value: 52 },
  { timestamp: "02:00", value: 49 },
  { timestamp: "03:00", value: 63 },
  { timestamp: "04:00", value: 58 },
  { timestamp: "05:00", value: 71 },
  { timestamp: "06:00", value: 73 },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <main className="container mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Click Nova</h1>
          <p className="text-xl text-muted-foreground">
            Ignite Your PC's Full Potential
          </p>
        </div>

        <div className="flex justify-center">
          <OptimizeButton className="w-full max-w-md" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="CPU Usage"
            value="45%"
            icon={<Cpu className="h-4 w-4" />}
            trend="down"
          />
          <MetricCard
            title="GPU Temperature"
            value="65°C"
            icon={<Gpu className="h-4 w-4" />}
            trend="neutral"
          />
          <MetricCard
            title="RAM Usage"
            value="8.2 GB"
            icon={<Ram className="h-4 w-4" />}
            trend="up"
          />
          <MetricCard
            title="Storage"
            value="256 GB"
            icon={<HardDrive className="h-4 w-4" />}
            trend="neutral"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceChart
            data={mockPerformanceData}
            title="System Performance"
            description="Overall system performance over time"
          />
          <PerformanceChart
            data={mockPerformanceData.map((d) => ({
              ...d,
              value: d.value * 0.8,
            }))}
            title="Memory Usage"
            description="Memory usage trends"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
