import { useState, useEffect } from 'react';
import { SystemMonitor } from '@/components/system-monitor';
import { TerminalWindow } from '@/components/terminal-window';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Index() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<{
    needsRestart: boolean;
    changes: string[];
  }>({ needsRestart: false, changes: [] });
  const { toast } = useToast();

  const addTerminalLine = (line: string) => {
    setTerminalOutput(prev => [...prev, line]);
  };

  const handleRestart = async () => {
    try {
      addTerminalLine('\n[ClickNova] > Initiating system restart...');
      const response = await fetch('http://localhost:3000/api/system/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'shutdown /r /t 60 /c "ClickNova optimization complete. System will restart in 60 seconds."' })
      });
      
      if (response.ok) {
        toast({
          title: "System Restart Scheduled",
          description: "Your computer will restart in 60 seconds to complete optimization.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Restart error:', error);
      toast({
        title: "Restart Failed",
        description: "Unable to restart system. Please restart manually.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setTerminalOutput([]);
    const changes: string[] = [];
    let needsRestart = false;

    try {
      // System optimization steps
      const steps = [
        {
          name: 'System Restore Point',
          command: 'Checkpoint-Computer -Description "ClickNova Automatic Backup" -RestorePointType "MODIFY_SETTINGS"'
        },
        {
          name: 'Registry Backup',
          command: 'reg export HKLM C:\\ClickNovaBackup\\Registry_$(Get-Date -Format "yyyyMMdd_HHmmss").reg /y'
        },
        {
          name: 'Critical System Files Backup',
          command: `
            $backupPath = "C:\\ClickNovaBackup\\SystemBackup_$(Get-Date -Format 'yyyyMMdd_HHmmss')";
            New-Item -ItemType Directory -Force -Path $backupPath;
            Copy-Item -Path "C:\\Windows\\System32\\config\\*" -Destination "$backupPath\\SystemConfig" -Force;
            Copy-Item -Path "C:\\Windows\\System32\\drivers\\etc\\*" -Destination "$backupPath\\NetworkConfig" -Force;
            Get-StartupCommand | Export-Csv "$backupPath\\StartupItems.csv" -NoTypeInformation;
            Get-Service | Export-Csv "$backupPath\\Services.csv" -NoTypeInformation;
          `
        },
        {
          name: 'Deep System Analysis',
          command: `
            Write-Output "=== System Information ===";
            Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,FreePhysicalMemory,TotalVisibleMemorySize;
            Write-Output "\n=== Disk Health ===";
            Get-PhysicalDisk | Select-Object FriendlyName,MediaType,HealthStatus,OperationalStatus;
            Write-Output "\n=== Memory Usage ===";
            Get-Process | Sort-Object -Property WS -Descending | Select-Object -First 5 Name,@{Name="MemoryMB";Expression={[math]::round($_.WS / 1MB, 2)}};
          `
        },
        {
          name: 'Windows Update Check',
          command: 'Get-WindowsUpdate -MicrosoftUpdate',
          needsRestart: true
        },
        {
          name: 'System Package Updates',
          command: 'winget upgrade --all --accept-source-agreements --accept-package-agreements',
          needsRestart: true
        },
        {
          name: 'PowerShell Module Updates',
          command: 'Update-Module -Name PSWindowsUpdate -Force; Install-Module -Name PSWindowsUpdate -Force -AllowClobber'
        },
        {
          name: 'Advanced Disk Cleanup',
          command: `
            cleanmgr /sagerun:1;
            Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue;
            Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue;
            Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue;
            Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Force -ErrorAction SilentlyContinue;
          `
        },
        {
          name: 'Advanced Disk Optimization',
          command: `
            Get-Volume | Where-Object {$_.DriveLetter} | ForEach-Object {
              Write-Output "Optimizing drive $($_.DriveLetter):";
              Optimize-Volume -DriveLetter $_.DriveLetter -ReTrim -Verbose;
            }
          `
        },
        {
          name: 'Memory Optimization',
          command: `
            Write-Output "Clearing system working set...";
            [System.Diagnostics.Process]::GetCurrentProcess().MinWorkingSet = [System.IntPtr]::Zero;
            Get-Process | Where-Object {$_.WorkingSet -gt 100MB} | Select-Object Name,@{Name="MemoryMB";Expression={[math]::round($_.WS / 1MB, 2)}};
          `
        },
        {
          name: 'Network Optimization',
          command: `
            Write-Output "Resetting network stack...";
            ipconfig /flushdns;
            netsh int ip reset;
            netsh winsock reset;
            Write-Output "Optimizing network adapters...";
            Get-NetAdapter | Where-Object Status -eq "Up" | Set-NetAdapter -AutoSense $true;
          `,
          needsRestart: true
        },
        {
          name: 'Service Optimization',
          command: `
            $services = @{
              'SysMain' = 'Automatic';
              'Schedule' = 'Automatic';
              'Power' = 'Automatic';
              'Windows Update' = 'Automatic';
              'Windows Search' = 'Automatic';
              'Windows Time' = 'Automatic'
            };
            foreach ($service in $services.GetEnumerator()) {
              $svc = Get-Service -Name $service.Key -ErrorAction SilentlyContinue;
              if ($svc -and $svc.StartType -ne $service.Value) {
                Set-Service -Name $service.Key -StartupType $service.Value;
                Write-Output "Optimized service: $($service.Key)";
              }
            }
          `,
          needsRestart: true
        },
        {
          name: 'Startup Optimization',
          command: `
            Write-Output "=== Current Startup Items ===";
            Get-CimInstance Win32_StartupCommand | Select-Object Name,Command,Location;
            Write-Output "\n=== High Impact Startup Items ===";
            Get-CimInstance Win32_StartupCommand | Where-Object {$_.Location -notlike "*Windows*"} | Select-Object Name,Command;
          `
        }
      ];

      addTerminalLine('[ClickNova] > Initializing advanced system optimization sequence...');
      await new Promise(resolve => setTimeout(resolve, 800));
      addTerminalLine('[ClickNova] > Running comprehensive system analysis...');
      await new Promise(resolve => setTimeout(resolve, 600));

      for (const step of steps) {
        addTerminalLine(`\n[ClickNova] > Initiating ${step.name}...`);
        
        try {
          const response = await fetch('http://localhost:3000/api/system/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: step.command })
          });

          const data = await response.json();
          if (data.output) {
            addTerminalLine(data.output);
            changes.push(`${step.name} completed successfully`);
          }
          if (step.needsRestart) {
            needsRestart = true;
          }
          addTerminalLine(`[ClickNova] > ${step.name} optimization complete ✓`);
        } catch (error) {
          addTerminalLine(`[ClickNova] > Error during ${step.name}: ${error}`);
          changes.push(`${step.name} failed: ${error}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setOptimizationResults({ needsRestart, changes });
      
      toast({
        title: "Optimization Complete",
        description: "Your system has been successfully optimized!",
        duration: 3000,
      });

      if (needsRestart) {
        setShowRestartDialog(true);
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "An error occurred during optimization.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            ClickNova
          </h1>
          <p className="text-xl text-cyan-200 font-light">
            Next-Gen System Optimization Suite
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-black/50 border-cyan-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">System Metrics</h2>
            <SystemMonitor />
          </Card>

          <Card className="p-6 bg-black/50 border-cyan-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Terminal Output</h2>
            <TerminalWindow output={terminalOutput} />
            <div className="mt-4">
              <Button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
              >
                {isOptimizing ? 'Optimizing...' : 'Initialize Optimization'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Dialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Restart Required</DialogTitle>
            <DialogDescription>
              Some optimizations require a system restart to take effect. Would you like to restart your system now?
              
              Changes made:
              {optimizationResults.changes.map((change, index) => (
                <div key={index} className="text-sm text-cyan-200">• {change}</div>
              ))}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRestartDialog(false)}
            >
              Restart Later
            </Button>
            <Button
              onClick={handleRestart}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              Restart Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
