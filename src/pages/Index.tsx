
import { Terminal, Cpu, HardDrive, MonitorSmartphone as Gpu, Microchip, Play, FileBarChart, ArrowRight } from "lucide-react";
import MetricCard from "@/components/ui/metric-card";
import PerformanceChart from "@/components/ui/performance-chart";
import { OptimizeButton } from "@/components/optimize-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

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
  },
  {
    title: "DISM Health Check",
    command: "DISM /Online /Cleanup-Image /CheckHealth",
    description: "Check Windows image for corruption",
  },
  {
    title: "Network Reset",
    command: "netsh winsock reset",
    description: "Reset network configuration to default",
  },
  {
    title: "DNS Cache Flush",
    command: "ipconfig /flushdns",
    description: "Clear DNS resolver cache",
  },
  {
    title: "Group Policy Update",
    command: "gpupdate /force",
    description: "Force update of Group Policy settings",
  },
  {
    title: "Boot Configuration",
    command: "bcdedit /enum",
    description: "Display boot configuration data",
  },
  {
    title: "Driver Query",
    command: "driverquery",
    description: "List all installed device drivers",
  },
  {
    title: "Task List",
    command: "tasklist /svc",
    description: "Display all running processes and services",
  },
  {
    title: "Resource Monitor",
    command: "resmon",
    description: "Launch Resource Monitor for detailed analysis",
  },
  {
    title: "Reliability Report",
    command: "perfmon /rel",
    description: "View system reliability history",
  }
];

interface SystemMetrics {
  cpuUsage: number;
  ramUsage: number;
  diskSpace: number;
  temperature: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"initial" | "scan" | "report" | "optimize" | "final">("initial");
  const [initialMetrics, setInitialMetrics] = useState<SystemMetrics | null>(null);
  const [finalMetrics, setFinalMetrics] = useState<SystemMetrics | null>(null);

  const simulateScan = async () => {
    setCurrentStep("scan");
    toast.info("Scanning system...");
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const metrics: SystemMetrics = {
      cpuUsage: Math.round(Math.random() * 30 + 60), // 60-90%
      ramUsage: Math.round(Math.random() * 40 + 50), // 50-90%
      diskSpace: Math.round(Math.random() * 20 + 70), // 70-90%
      temperature: Math.round(Math.random() * 15 + 60), // 60-75°C
    };
    
    setInitialMetrics(metrics);
    setCurrentStep("report");
    toast.success("System scan complete!");
  };

  const runOptimizations = async () => {
    setCurrentStep("optimize");
    toast.info("Running optimization commands...");
    
    // Simulate optimization delay
    for (const step of optimizationSteps) {
      toast.info(`Running: ${step.title}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const improvedMetrics: SystemMetrics = {
      cpuUsage: Math.round((initialMetrics?.cpuUsage || 0) * 0.7),
      ramUsage: Math.round((initialMetrics?.ramUsage || 0) * 0.6),
      diskSpace: Math.round((initialMetrics?.diskSpace || 0) * 0.8),
      temperature: Math.round((initialMetrics?.temperature || 0) * 0.85),
    };
    
    setFinalMetrics(improvedMetrics);
    setCurrentStep("final");
    toast.success("Optimizations complete!");
  };

  const renderMetricComparison = () => {
    if (!initialMetrics || !finalMetrics) return null;

    const comparisonData = [
      {
        name: "Before",
        cpu: initialMetrics.cpuUsage,
        ram: initialMetrics.ramUsage,
        disk: initialMetrics.diskSpace,
        temp: initialMetrics.temperature,
      },
      {
        name: "After",
        cpu: finalMetrics.cpuUsage,
        ram: finalMetrics.ramUsage,
        disk: finalMetrics.diskSpace,
        temp: finalMetrics.temperature,
      },
    ];

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceChart
          data={comparisonData.map(d => ({ timestamp: d.name, value: d.cpu }))}
          title="CPU Usage Improvement"
          description="Lower is better"
          className="glass-morphism"
        />
        <PerformanceChart
          data={comparisonData.map(d => ({ timestamp: d.name, value: d.ram }))}
          title="RAM Usage Improvement"
          description="Lower is better"
          className="glass-morphism"
        />
      </div>
    );
  };

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

        <div className="flex justify-center gap-4">
          {currentStep === "initial" && (
            <Button
              onClick={simulateScan}
              className="glass-morphism border border-[#4361EE]/20 hover:border-[#4361EE]/50"
            >
              <Play className="mr-2 h-4 w-4" /> Start System Scan
            </Button>
          )}
          
          {currentStep === "report" && (
            <Button
              onClick={runOptimizations}
              className="glass-morphism border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50"
            >
              <ArrowRight className="mr-2 h-4 w-4" /> Run Optimizations
            </Button>
          )}
        </div>

        {(initialMetrics || finalMetrics) && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="CPU Usage"
              value={`${finalMetrics?.cpuUsage || initialMetrics?.cpuUsage}%`}
              icon={<Cpu className="h-4 w-4 text-[#4361EE]" />}
              trend={finalMetrics ? "down" : "neutral"}
              className="glass-morphism border border-[#4361EE]/20 hover:border-[#4361EE]/50 transition-all duration-300"
            />
            <MetricCard
              title="Temperature"
              value={`${finalMetrics?.temperature || initialMetrics?.temperature}°C`}
              icon={<Gpu className="h-4 w-4 text-[#8B5CF6]" />}
              trend={finalMetrics ? "down" : "neutral"}
              className="glass-morphism border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
            />
            <MetricCard
              title="RAM Usage"
              value={`${finalMetrics?.ramUsage || initialMetrics?.ramUsage}%`}
              icon={<Microchip className="h-4 w-4 text-[#D946EF]" />}
              trend={finalMetrics ? "down" : "up"}
              className="glass-morphism border border-[#D946EF]/20 hover:border-[#D946EF]/50 transition-all duration-300"
            />
            <MetricCard
              title="Disk Usage"
              value={`${finalMetrics?.diskSpace || initialMetrics?.diskSpace}%`}
              icon={<HardDrive className="h-4 w-4 text-[#F97316]" />}
              trend={finalMetrics ? "down" : "neutral"}
              className="glass-morphism border border-[#F97316]/20 hover:border-[#F97316]/50 transition-all duration-300"
            />
          </div>
        )}

        {currentStep === "final" && renderMetricComparison()}

        {(currentStep === "report" || currentStep === "optimize") && (
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
        )}
      </main>
    </div>
  );
};

export default Index;
