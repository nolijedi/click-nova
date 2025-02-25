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
  Keyboard,
  Mouse,
  Eye,
  Trash
} from 'lucide-react';

export const optimizationCommands = {
  system: [
    {
      id: 'clear-temp',
      title: 'Clear System Cache',
      description: 'Remove temporary files and system cache',
      icon: Trash2,
      command: `
        # Clear user temp files
        Get-ChildItem -Path $env:TEMP -Recurse -Force | 
        ForEach-Object {
            try {
                Remove-Item $_.FullName -Force -Recurse -ErrorAction SilentlyContinue
            } catch {
                Write-Warning "Could not remove $($_.FullName)"
            }
        }
        
        # Clear Windows temp files (requires admin)
        try {
            Remove-Item -Path "C:\\Windows\\Temp\\*" -Force -Recurse -ErrorAction SilentlyContinue
        } catch {
            Write-Warning "Could not access Windows Temp folder"
        }
        
        # Clear Prefetch (requires admin)
        try {
            Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Warning "Could not access Prefetch folder"
        }
        
        Write-Output "Cache cleanup completed with available permissions"
      `,
      type: 'powershell',
      gradientFrom: 'blue-500',
      gradientTo: 'cyan-500'
    },
    {
      id: 'disk-cleanup',
      title: 'Disk Cleanup',
      description: 'Clean up unnecessary system files',
      icon: Trash,
      command: `
        # Run disk cleanup silently
        try {
            Write-Output "Starting disk cleanup..."
            Start-Process -FilePath cleanmgr.exe -ArgumentList '/sagerun:1' -Wait -WindowStyle Hidden
            Write-Output "Disk cleanup process completed"
        } catch {
            Write-Warning "Error during disk cleanup: $_"
        }

        # Clear user temp files
        try {
            Write-Output "Cleaning temporary files..."
            Remove-Item -Path "$env:TEMP\\*" -Force -Recurse -ErrorAction SilentlyContinue
            Write-Output "Temporary files cleaned"
        } catch {
            Write-Warning "Error cleaning temp files: $_"
        }

        # Clean Windows Update cache
        try {
            Write-Output "Cleaning Windows Update cache..."
            Stop-Service -Name wuauserv -ErrorAction SilentlyContinue
            Remove-Item -Path "$env:SystemRoot\\SoftwareDistribution\\*" -Force -Recurse -ErrorAction SilentlyContinue
            Start-Service -Name wuauserv -ErrorAction SilentlyContinue
            Write-Output "Windows Update cache cleaned"
        } catch {
            Write-Warning "Error cleaning Windows Update cache: $_"
        }

        Write-Output "Cleanup completed"
      `,
      type: 'powershell',
      gradientFrom: 'red-500',
      gradientTo: 'orange-500'
    }
  ],
  performance: [
    {
      id: 'optimize-disk',
      title: 'Disk Performance',
      description: 'Optimize and defrag all drives',
      icon: HardDrive,
      command: `
        Get-Volume | Where-Object { $_.DriveType -eq 'Fixed' } | ForEach-Object {
            try {
                $drive = $_
                if ($drive.DriveLetter) {
                    Write-Output "Optimizing drive $($drive.DriveLetter)..."
                    Optimize-Volume -DriveLetter $drive.DriveLetter -ReTrim -Verbose
                    Write-Output "Completed optimization for drive $($drive.DriveLetter)"
                }
            } catch {
                Write-Warning "Failed to optimize drive $($drive.DriveLetter): $_"
            }
        }
        Write-Output "Disk optimization completed"
      `,
      type: 'powershell',
      gradientFrom: 'purple-500',
      gradientTo: 'pink-500'
    },
    {
      id: 'clear-cache',
      title: 'Clear Cache',
      description: 'Clear system and user cache files',
      icon: Trash2,
      command: `
        # Clear user temp files
        Write-Output "Clearing user temp files..."
        Get-ChildItem -Path $env:TEMP -Recurse -Force -ErrorAction SilentlyContinue | 
        ForEach-Object {
            try {
                if (-not $_.PSIsContainer) {
                    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
                }
            } catch {
                Write-Warning "Could not remove: $($_.FullName)"
            }
        }
        Write-Output "User temp files cleared"

        # Clear Windows temp files
        Write-Output "Clearing Windows temp files..."
        try {
            Get-ChildItem -Path "$env:windir\\Temp" -Recurse -Force -ErrorAction SilentlyContinue |
            ForEach-Object {
                if (-not $_.PSIsContainer) {
                    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
                }
            }
            Write-Output "Windows temp files cleared"
        } catch {
            Write-Warning "Could not access some Windows temp files"
        }

        # Clear Prefetch
        Write-Output "Clearing Prefetch files..."
        try {
            Get-ChildItem -Path "$env:windir\\Prefetch" -Force -ErrorAction SilentlyContinue |
            ForEach-Object {
                if (-not $_.PSIsContainer) {
                    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
                }
            }
            Write-Output "Prefetch files cleared"
        } catch {
            Write-Warning "Could not access Prefetch folder"
        }

        # Clear DNS Cache
        Write-Output "Clearing DNS cache..."
        try {
            ipconfig /flushdns | Out-Null
            Write-Output "DNS cache cleared"
        } catch {
            Write-Warning "Could not clear DNS cache"
        }

        Write-Output "Cache cleanup completed"
      `,
      type: 'powershell',
      gradientFrom: 'yellow-500',
      gradientTo: 'red-500'
    }
  ],
  memory: [
    {
      id: 'memory-boost',
      title: 'Memory Boost',
      description: 'Optimize memory usage and clear standby list',
      icon: CircuitBoard,
      command: `
        # Get and display memory-intensive processes
        Get-Process | 
        Where-Object { $_.WorkingSet -gt 100MB } | 
        Sort-Object WorkingSet -Descending | 
        Select-Object Name, @{Name="Memory (MB)";Expression={[math]::Round($_.WorkingSet / 1MB, 2)}} |
        Format-Table -AutoSize

        try {
            # Optimize pagefile settings
            $computerSystem = Get-WmiObject Win32_ComputerSystem
            $computerSystem.AutomaticManagedPagefile = $false
            $computerSystem.Put()

            $pageFileSetting = Get-WmiObject Win32_PageFileSetting
            if ($pageFileSetting) {
                $pageFileSetting.InitialSize = 8192  # 8GB initial size
                $pageFileSetting.MaximumSize = 16384 # 16GB maximum size
                $pageFileSetting.Put()
                Write-Output "Pagefile settings optimized"
            }
        } catch {
            Write-Warning "Failed to optimize pagefile settings"
        }

        # Clear standby list and working sets
        try {
            [System.GC]::Collect()
            [System.GC]::WaitForPendingFinalizers()
            Write-Output "Memory cleaned up successfully"
        } catch {
            Write-Warning "Failed to clean up memory"
        }

        Write-Output "Memory optimization completed"
      `,
      type: 'powershell',
      gradientFrom: 'red-500',
      gradientTo: 'orange-500'
    },
    {
      id: 'service-optimizer',
      title: 'Service Optimizer',
      description: 'Optimize Windows services for better performance',
      icon: Settings,
      command: `
        $servicesToOptimize = @(
            # List of non-essential services that can be safely optimized
            'DiagTrack',          # Connected User Experiences and Telemetry
            'WSearch',            # Windows Search
            'SysMain',            # Superfetch
            'WerSvc',             # Windows Error Reporting
            'TabletInputService', # Touch Keyboard and Handwriting
            'PcaSvc'             # Program Compatibility Assistant
        )

        foreach ($service in $servicesToOptimize) {
            try {
                $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
                if ($svc) {
                    if ($svc.Status -eq 'Running') {
                        Stop-Service -Name $service -Force -ErrorAction SilentlyContinue
                        Write-Output "Stopped service: $service"
                    }
                    Set-Service -Name $service -StartupType Manual -ErrorAction SilentlyContinue
                    Write-Output "Set $service to manual startup"
                }
            } catch {
                Write-Warning "Could not optimize service: $service"
            }
        }

        Write-Output "Service optimization completed"
      `,
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
      id: 'firewall-optimizer',
      title: 'Firewall Optimizer',
      description: 'Reset and optimize Windows Firewall',
      icon: Shield,
      command: `
        try {
            Write-Output "Resetting Windows Firewall..."
            $result = netsh advfirewall reset 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Output "Firewall reset successful"
            } else {
                Write-Warning "Failed to reset firewall: $result"
            }
        } catch {
            Write-Warning "Error resetting firewall: $_"
        }

        try {
            Write-Output "Enabling firewall for all profiles..."
            $result = netsh advfirewall set allprofiles state on 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Output "Firewall enabled for all profiles"
            } else {
                Write-Warning "Failed to enable firewall: $result"
            }
        } catch {
            Write-Warning "Error enabling firewall: $_"
        }

        try {
            Write-Output "Setting firewall policy..."
            $result = netsh advfirewall set allprofiles firewallpolicy blockinbound,allowoutbound 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Output "Firewall policy set successfully"
            } else {
                Write-Warning "Failed to set firewall policy: $result"
            }
        } catch {
            Write-Warning "Error setting firewall policy: $_"
        }

        Write-Output "Firewall optimization completed"
      `,
      type: 'powershell',
      gradientFrom: 'blue-500',
      gradientTo: 'indigo-500'
    }
  ],
  gaming: [
    {
      id: 'gaming-mode',
      title: 'Gaming Mode',
      description: 'Optimize system for gaming performance',
      icon: Power,
      command: `
        try {
            # Create high performance power scheme
            Write-Output "Creating high performance power scheme..."
            powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
        } catch {
            Write-Warning "Failed to create power scheme: $_"
        }

        try {
            # Disable dynamic tick
            Write-Output "Configuring system timer..."
            bcdedit /set useplatformclock false
            bcdedit /set disabledynamictick yes
        } catch {
            Write-Warning "Failed to configure system timer: $_"
        }

        try {
            # Set system responsiveness
            Write-Output "Optimizing system responsiveness..."
            $path = 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile'
            Set-ItemProperty -Path $path -Name 'SystemResponsiveness' -Value 0 -Type DWord
            Write-Output "System responsiveness optimized"
        } catch {
            Write-Warning "Failed to set system responsiveness: $_"
        }

        Write-Output "Gaming mode optimization completed"
      `,
      type: 'powershell',
      gradientFrom: 'green-500',
      gradientTo: 'emerald-500'
    },
    {
      id: 'input-latency',
      title: 'Input Latency',
      description: 'Optimize mouse and keyboard settings',
      icon: Mouse,
      command: `
        try {
            Write-Output "Optimizing mouse sensitivity..."
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseSensitivity" -Value "10" -Type String
            Write-Output "Mouse sensitivity optimized"
        } catch {
            Write-Warning "Failed to set mouse sensitivity: $_"
        }

        try {
            Write-Output "Optimizing keyboard settings..."
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Keyboard" -Name "KeyboardDelay" -Value "0" -Type String
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Keyboard" -Name "KeyboardSpeed" -Value "31" -Type String
            Write-Output "Keyboard settings optimized"
        } catch {
            Write-Warning "Failed to set keyboard settings: $_"
        }

        Write-Output "Input latency optimization completed"
      `,
      type: 'powershell',
      gradientFrom: 'yellow-500',
      gradientTo: 'amber-500'
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
      icon: Eye,
      command: `
        try {
            Write-Output "Optimizing visual effects..."
            # Set visual effects to custom
            Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Value 2 -Type DWord

            # Disable animations
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "DragFullWindows" -Value "0" -Type String
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "MenuShowDelay" -Value "0" -Type String
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -Value "0" -Type String

            # Set performance mask
            Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "UserPreferencesMask" -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00)) -Type Binary

            Write-Output "Visual effects optimized for performance"
        } catch {
            Write-Warning "Failed to optimize visual effects: $_"
        }

        Write-Output "Visual effects optimization completed"
      `,
      type: 'powershell',
      gradientFrom: 'violet-500',
      gradientTo: 'purple-500'
    }
  ]
};
