
import { Cpu, HardDrive, MonitorSmartphone as Gpu, Microchip } from "lucide-react";
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
    <div className="min-h-screen bg-[#1A1F2C] text-foreground p-6">
      <main className="container mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[#4361EE] via-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text animate-pulse">
            Click Nova
          </h1>
          <p className="text-xl text-[#8B5CF6]">
            {"<"} Ignite Your System's True Potential {"/>"}
          </p>
        </div>

        <div className="flex justify-center">
          <OptimizeButton className="w-full max-w-md glass-morphism" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="CPU Usage"
            value="45%"
            icon={<Cpu className="h-4 w-4 text-[#4361EE]" />}
            trend="down"
            className="glass-morphism border border-[#4361EE]/20 hover:border-[#4361EE]/50 transition-all duration-300"
          />
          <MetricCard
            title="GPU Temperature"
            value="65°C"
            icon={<Gpu className="h-4 w-4 text-[#8B5CF6]" />}
            trend="neutral"
            className="glass-morphism border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
          />
          <MetricCard
            title="RAM Usage"
            value="8.2 GB"
            icon={<Microchip className="h-4 w-4 text-[#D946EF]" />}
            trend="up"
            className="glass-morphism border border-[#D946EF]/20 hover:border-[#D946EF]/50 transition-all duration-300"
          />
          <MetricCard
            title="Storage"
            value="256 GB"
            icon={<HardDrive className="h-4 w-4 text-[#F97316]" />}
            trend="neutral"
            className="glass-morphism border border-[#F97316]/20 hover:border-[#F97316]/50 transition-all duration-300"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceChart
            data={mockPerformanceData}
            title="System Performance"
            description="Real-time system metrics analysis"
            className="glass-morphism border border-[#4361EE]/20 hover:border-[#4361EE]/50 transition-all duration-300"
          />
          <PerformanceChart
            data={mockPerformanceData.map((d) => ({
              ...d,
              value: d.value * 0.8,
            }))}
            title="Memory Usage"
            description="Dynamic memory allocation tracking"
            className="glass-morphism border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
