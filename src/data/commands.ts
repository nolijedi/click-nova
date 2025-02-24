import { 
  Cpu, 
  HardDrive, 
  Trash2, 
  Zap,
  Network,
  CircuitBoard,
  Settings,
  Power,
  Shield,
  Database,
  Wifi,
  Monitor,
  Keyboard
} from 'lucide-react';

export const optimizationCommands = {
  system: [
    {
      id: 'clear-temp',
      title: 'Clear System Cache',
      description: 'Remove temporary files and system cache',
      icon: Trash2,
      command: 'Get-ChildItem -Path $env:TEMP -Recurse -Force | Remove-Item -Force -Recurse; Get-ChildItem -Path C:\\Windows\\Temp -Recurse -Force | Remove-Item -Force -Recurse; Get-ChildItem -Path C:\\Windows\\Prefetch -Force | Remove-Item -Force',
      type: 'powershell',
      gradientFrom: 'blue-500',
      gradientTo: 'cyan-500'
    },
    {
      id: 'disk-cleanup',
      title: 'Deep Disk Cleanup',
      description: 'Run advanced disk cleanup and remove old Windows updates',
      icon: HardDrive,
      command: 'cleanmgr /sageset:1 & cleanmgr /sagerun:1; Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase',
      type: 'cmd',
      gradientFrom: 'green-500',
      gradientTo: 'emerald-500'
    }
  ],
  performance: [
    {
      id: 'optimize-disk',
      title: 'Disk Performance',
      description: 'Optimize and defrag all drives',
      icon: HardDrive,
      command: 'Get-PhysicalDisk | ForEach-Object { Optimize-Volume -DriveLetter $_.DeviceId.ToString() -Defrag -Verbose }',
      type: 'powershell',
      gradientFrom: 'purple-500',
      gradientTo: 'pink-500'
    },
    {
      id: 'network-boost',
      title: 'Network Boost',
      description: 'Reset and optimize network settings',
      icon: Wifi,
      command: 'ipconfig /flushdns & netsh winsock reset & netsh int ip reset & netsh int tcp set global autotuninglevel=normal & netsh int tcp set global chimney=enabled & netsh int tcp set global dca=enabled & netsh int tcp set global netdma=enabled & netsh int tcp set global ecncapability=enabled & netsh int tcp set global timestamps=disabled',
      type: 'cmd',
      gradientFrom: 'yellow-500',
      gradientTo: 'orange-500'
    }
  ],
  memory: [
    {
      id: 'memory-optimization',
      title: 'Memory Boost',
      description: 'Optimize memory usage and clear standby list',
      icon: Database,
      command: 'Get-Process | Where-Object {$_.WorkingSet -gt 100MB} | Sort-Object WorkingSet -Descending | Select-Object Name, @{Name="Memory (MB)";Expression={$_.WorkingSet / 1MB}}; wmic os set AutomaticManagedPagefile=False; wmic computersystem set AutomaticManagedPagefile=False; wmic pagefileset create name="C:\\pagefile.sys" initialsize=8192 maximumsize=8192',
      type: 'powershell',
      gradientFrom: 'red-500',
      gradientTo: 'orange-500'
    },
    {
      id: 'service-optimizer',
      title: 'Service Optimizer',
      description: 'Optimize Windows services for better performance',
      icon: Settings,
      command: 'Get-Service | Where-Object {$_.Status -eq "Running" -and $_.StartType -eq "Automatic" -and $_.Name -notmatch "Windows|Network|Security"} | Set-Service -StartupType Manual -PassThru | Stop-Service -Force',
      type: 'powershell',
      gradientFrom: 'indigo-500',
      gradientTo: 'violet-500'
    }
  ],
  security: [
    {
      id: 'security-scan',
      title: 'Security Scan',
      description: 'Run Windows Defender scan and update security',
      icon: Shield,
      command: 'Start-MpScan -ScanType QuickScan; Set-MpPreference -DisableRealtimeMonitoring $false -DisableIntrusionPreventionSystem $false -DisableIOAVProtection $false -DisableScriptScanning $false -EnableControlledFolderAccess Enabled',
      type: 'powershell',
      gradientFrom: 'teal-500',
      gradientTo: 'emerald-500'
    },
    {
      id: 'firewall-optimize',
      title: 'Firewall Optimizer',
      description: 'Reset and optimize Windows Firewall',
      icon: Shield,
      command: 'netsh advfirewall reset & netsh advfirewall set allprofiles state on & netsh advfirewall set allprofiles firewallpolicy blockinbound,allowoutbound',
      type: 'cmd',
      gradientFrom: 'rose-500',
      gradientTo: 'pink-500'
    }
  ],
  gaming: [
    {
      id: 'gaming-mode',
      title: 'Gaming Mode',
      description: 'Optimize system for gaming performance',
      icon: Zap,
      command: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61; bcdedit /set useplatformclock false; bcdedit /set disabledynamictick yes; Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" -Name "SystemResponsiveness" -Value 0',
      type: 'powershell',
      gradientFrom: 'blue-600',
      gradientTo: 'indigo-600'
    },
    {
      id: 'input-latency',
      title: 'Input Latency',
      description: 'Reduce input lag and optimize mouse/keyboard',
      icon: Keyboard,
      command: 'reg add "HKEY_CURRENT_USER\\Control Panel\\Mouse" /v "MouseSensitivity" /t REG_SZ /d "10" /f & reg add "HKEY_CURRENT_USER\\Control Panel\\Keyboard" /v "KeyboardDelay" /t REG_SZ /d "0" /f & reg add "HKEY_CURRENT_USER\\Control Panel\\Keyboard" /v "KeyboardSpeed" /t REG_SZ /d "31" /f',
      type: 'cmd',
      gradientFrom: 'purple-600',
      gradientTo: 'pink-600'
    }
  ],
  display: [
    {
      id: 'display-optimize',
      title: 'Display Performance',
      description: 'Optimize display settings for performance',
      icon: Monitor,
      command: 'reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop" /v "DragFullWindows" /t REG_SZ /d "0" /f & reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop" /v "MenuShowDelay" /t REG_SZ /d "0" /f & reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop\\WindowMetrics" /v "MinAnimate" /t REG_SZ /d "0" /f',
      type: 'cmd',
      gradientFrom: 'emerald-600',
      gradientTo: 'teal-600'
    },
    {
      id: 'visual-effects',
      title: 'Visual Effects',
      description: 'Optimize visual effects for performance',
      icon: Monitor,
      command: 'reg add "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v "VisualFXSetting" /t REG_DWORD /d "2" /f & reg add "HKEY_CURRENT_USER\\Control Panel\\Desktop" /v "UserPreferencesMask" /t REG_BINARY /d "9012038010000000" /f',
      type: 'cmd',
      gradientFrom: 'cyan-600',
      gradientTo: 'blue-600'
    }
  ]
};
