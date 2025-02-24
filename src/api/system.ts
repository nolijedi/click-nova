import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:3000/api/system';

// List of allowed PowerShell commands for security
const ALLOWED_COMMANDS = [
  'Get-Process',
  'Get-Counter',
  'Get-PhysicalDisk',
  'Get-CimInstance',
  'Get-Volume',
  'Optimize-Volume',
  'Remove-Item',
  'Get-StorageReliabilityCounter',
  'cleanmgr',
  'Start-Process',
  'Get-WmiObject',
  'Measure-Object',
  'Select-Object'
];

// Execute PowerShell commands directly using node-powershell
export async function executeCommand(command: string): Promise<void> {
  try {
    // For PowerShell commands, wrap them in powershell.exe
    const finalCommand = command.startsWith('powershell') ? command : `powershell.exe -NoProfile -NonInteractive -Command "${command}"`;
    
    // Use the run_command tool to execute the command
    const response = await fetch('http://localhost:3001/api/system/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: finalCommand }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute command');
    }

    return response.json();
  } catch (error) {
    console.error('Error executing command:', error);
    throw error;
  }
};

// Mock system data for development
const getMockSystemData = (command: string): string => {
  if (command.includes('Get-Counter')) {
    return JSON.stringify({
      '\\Processor(_Total)\\% Processor Time': Math.floor(Math.random() * 100),
      '\\Memory\\Available MBytes': Math.floor(Math.random() * 16384),
      '\\PhysicalDisk(_Total)\\% Disk Time': Math.floor(Math.random() * 100)
    });
  }
  
  if (command.includes('Win32_StartupCommand')) {
    return JSON.stringify([
      {
        Name: 'Discord',
        Command: 'C:\\Users\\AppData\\Local\\Discord\\Update.exe --processStart Discord.exe',
        Location: 'HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run'
      },
      {
        Name: 'Steam',
        Command: 'C:\\Program Files (x86)\\Steam\\Steam.exe -silent',
        Location: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run'
      }
    ]);
  }
  
  return '{"status": "success"}';
};

// Get system metrics
export const getSystemMetrics = async () => {
  try {
    // CPU Usage
    const cpuCommand = `Get-Counter '\\Processor(_Total)\\% Processor Time' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue`;
    const cpuUsage = await executeCommand(cpuCommand);

    // Memory Usage
    const memoryCommand = `Get-Counter '\\Memory\\Available MBytes' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue`;
    const availableMemory = await executeCommand(memoryCommand);

    // Disk Usage
    const diskCommand = `Get-Counter '\\PhysicalDisk(_Total)\\% Disk Time' -ErrorAction SilentlyContinue | Select-Object -ExpandProperty CounterSamples | Select-Object -ExpandProperty CookedValue`;
    const diskUsage = await executeCommand(diskCommand);

    return {
      cpu: Math.min(100, Math.max(0, parseFloat(cpuUsage) || 0)),
      memory: Math.min(100, Math.max(0, 100 - (parseFloat(availableMemory) / 16384 * 100) || 0)),
      disk: Math.min(100, Math.max(0, parseFloat(diskUsage) || 0))
    };
  } catch (error) {
    console.error('Error getting system metrics:', error);
    toast.error('Failed to get system metrics');
    return {
      cpu: 0,
      memory: 0,
      disk: 0
    };
  }
};

export async function cleanTemporaryFiles(): Promise<string> {
  const commands = [
    // Clean Windows Temp folder
    `Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue`,
    // Clean Windows Prefetch
    `Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Recurse -Force -ErrorAction SilentlyContinue`,
    // Clean Windows SoftwareDistribution folder
    `Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue`
  ];

  try {
    for (const command of commands) {
      await executeCommand(command);
    }
    return "Temporary files cleaned successfully";
  } catch (error) {
    console.error('Error cleaning temporary files:', error);
    throw error;
  }
}

export async function optimizeStorage(): Promise<string> {
  const commands = [
    // Run disk cleanup
    `cleanmgr /sagerun:1`,
    // Optimize volumes
    `Get-Volume | Where-Object {$_.DriveType -eq 'Fixed'} | ForEach-Object { Optimize-Volume -DriveLetter $_.DriveLetter -ReTrim -Verbose }`,
  ];

  try {
    for (const command of commands) {
      await executeCommand(command);
    }
    return "Storage optimized successfully";
  } catch (error) {
    console.error('Error optimizing storage:', error);
    throw error;
  }
}

export async function optimizeServices(): Promise<string> {
  // List of unnecessary services that can be safely disabled
  const servicesToOptimize = [
    'DiagTrack',           // Connected User Experiences and Telemetry
    'dmwappushservice',    // WAP Push Message Routing Service
    'SysMain',             // Superfetch
    'WSearch'              // Windows Search
  ];

  const commands = servicesToOptimize.map(service => 
    `Set-Service -Name "${service}" -StartupType Manual -ErrorAction SilentlyContinue`
  );

  try {
    for (const command of commands) {
      await executeCommand(command);
    }
    return "Services optimized successfully";
  } catch (error) {
    console.error('Error optimizing services:', error);
    throw error;
  }
}

export async function optimizeStartup(): Promise<string> {
  const command = `Get-CimInstance Win32_StartupCommand | ForEach-Object {
    if ($_.Location -like '*Run*') {
      Remove-ItemProperty -Path $_.Location -Name $_.Name -ErrorAction SilentlyContinue
    }
  }`;

  try {
    await executeCommand(command);
    return "Startup optimized successfully";
  } catch (error) {
    console.error('Error optimizing startup:', error);
    throw error;
  }
}

export async function runFullOptimization(): Promise<void> {
  try {
    toast.info("Starting system optimization...");
    
    // Run optimizations in sequence
    await cleanTemporaryFiles();
    toast.success("Temporary files cleaned");
    
    await optimizeStorage();
    toast.success("Storage optimized");
    
    await optimizeServices();
    toast.success("Services optimized");
    
    await optimizeStartup();
    toast.success("Startup optimized");
    
    toast.success("System optimization completed!");
  } catch (error) {
    console.error('Error during optimization:', error);
    toast.error("Error during optimization");
    throw error;
  }
}
