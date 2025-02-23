import { 
  Cpu, 
  HardDrive, 
  Trash2, 
  Zap,
  Network,
  CircuitBoard,
  Settings,
  Power,
  Shield
} from 'lucide-react';

export const optimizationCommands = {
  system: [
    {
      id: 'clear-temp',
      title: 'Clear Temporary Files',
      description: 'Remove temporary files to free up disk space',
      icon: Trash2,
      command: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force',
      type: 'powershell',
      gradientFrom: 'blue-500',
      gradientTo: 'cyan-500',
      xp: 50
    },
    {
      id: 'disk-cleanup',
      title: 'Disk Cleanup',
      description: 'Run system disk cleanup utility',
      icon: HardDrive,
      command: 'cleanmgr /sagerun:1',
      type: 'cmd',
      gradientFrom: 'green-500',
      gradientTo: 'emerald-500',
      xp: 75
    }
  ],
  performance: [
    {
      id: 'stop-unused',
      title: 'Stop Unused Services',
      description: 'Stop unnecessary background services',
      icon: Power,
      command: 'Get-Service | Where-Object {$_.Status -eq "Running" -and $_.StartType -eq "Automatic"} | Stop-Service -Force',
      type: 'powershell',
      gradientFrom: 'purple-500',
      gradientTo: 'pink-500',
      xp: 100
    },
    {
      id: 'clear-dns',
      title: 'Clear DNS Cache',
      description: 'Clear DNS resolver cache',
      icon: Network,
      command: 'ipconfig /flushdns',
      type: 'cmd',
      gradientFrom: 'yellow-500',
      gradientTo: 'orange-500',
      xp: 25
    }
  ],
  memory: [
    {
      id: 'clear-memory',
      title: 'Clear Memory',
      description: 'Clear system memory cache',
      icon: CircuitBoard,
      command: 'Get-Process | Where-Object {$_.WorkingSet -gt 100MB} | Stop-Process -Force',
      type: 'powershell',
      gradientFrom: 'red-500',
      gradientTo: 'rose-500',
      xp: 75
    }
  ],
  security: [
    {
      id: 'check-updates',
      title: 'Check Updates',
      description: 'Check for Windows updates',
      icon: Shield,
      command: 'UsoClient StartScan',
      type: 'cmd',
      gradientFrom: 'indigo-500',
      gradientTo: 'violet-500',
      xp: 50
    }
  ]
};
