
import { Terminal, Cpu, HardDrive, MonitorSmartphone as Gpu, Microchip } from "lucide-react";
import MetricCard from "@/components/ui/metric-card";
import PerformanceChart from "@/components/ui/performance-chart";
import { OptimizeButton } from "@/components/optimize-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const optimizationSteps = [
  {
    title: "Clean Temporary Files",
    command: "cleanmgr.exe",
    description: "Windows Disk Cleanup utility to remove temporary files",
  },
  {
    title: "Check Disk Health",
    command: "chkdsk C: /f",
    description: "Scan and fix disk errors (requires restart)",
  },
  {
    title: "System File Check",
    command: "sfc /scannow",
    description: "Scan and repair Windows system files",
  },
  {
    title: "Memory Diagnostic",
    command: "mdsched.exe",
    description: "Windows Memory Diagnostic tool (requires restart)",
  },
  {
    title: "Performance Monitor",
    command: "perfmon.exe",
    description: "Monitor real-time system performance",
  },
  {
    title: "Power Configuration",
    command: "powercfg /energy",
    description: "Generate power efficiency diagnostics report",
  }
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
            {"<"} Command Prompt Optimization Guide {"/>"}
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {optimizationSteps.map((step, index) => (
            <Card key={index} className="glass-morphism border border-[#4361EE]/20 hover:border-[#4361EE]/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-[#4361EE]" />
                  {step.title}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-[#8B5CF6]">
                  {step.command}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
