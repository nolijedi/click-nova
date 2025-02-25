# Turbo Smooth Optimizer System Script
# Run with administrator privileges for best results

$Host.UI.RawUI.WindowTitle = "Turbo Smooth Optimizer"
Write-Host "Starting Turbo Smooth Optimizer..." -ForegroundColor Cyan

function Write-Status {
    param([string]$Message)
    Write-Host "`n==> $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "WARNING: $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
}

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "Running with administrator privileges - full optimization available`n" -ForegroundColor Green
} else {
    Write-Host "Running without administrator privileges - some optimizations may be limited`n" -ForegroundColor Yellow
}

# Disk Cleanup
Write-Status "Starting Disk Cleanup"
try {
    Write-Host "Running disk cleanup utility..."
    Start-Process -FilePath cleanmgr.exe -ArgumentList '/sagerun:1' -Wait -WindowStyle Hidden
    Write-Host "Disk cleanup completed" -ForegroundColor Green
} catch {
    Write-Error "Failed to run disk cleanup: $_"
}

# Clear User Temp Files
Write-Status "Clearing Temporary Files"
try {
    $tempFolders = @(
        $env:TEMP,
        $env:TMP,
        "$env:LOCALAPPDATA\Temp"
    )
    foreach ($folder in $tempFolders) {
        Write-Host "Cleaning $folder..."
        Get-ChildItem -Path $folder -File -Recurse -ErrorAction SilentlyContinue | 
        Where-Object { -not $_.PSIsContainer } |
        Remove-Item -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Temporary files cleared" -ForegroundColor Green
} catch {
    Write-Error "Error clearing temp files: $_"
}

# Clear Windows Temp Files
if ($isAdmin) {
    Write-Status "Clearing Windows Temp Files"
    try {
        Write-Host "Cleaning Windows temp directory..."
        Get-ChildItem -Path "$env:windir\Temp" -Recurse -Force -ErrorAction SilentlyContinue |
        Where-Object { -not $_.PSIsContainer } |
        Remove-Item -Force -ErrorAction SilentlyContinue
        Write-Host "Windows temp files cleared" -ForegroundColor Green
    } catch {
        Write-Error "Error clearing Windows temp files: $_"
    }

    Write-Status "Clearing Prefetch Files"
    try {
        Write-Host "Cleaning prefetch directory..."
        Get-ChildItem -Path "$env:windir\Prefetch" -Force -ErrorAction SilentlyContinue |
        Where-Object { -not $_.PSIsContainer } |
        Remove-Item -Force -ErrorAction SilentlyContinue
        Write-Host "Prefetch files cleared" -ForegroundColor Green
    } catch {
        Write-Error "Error clearing prefetch files: $_"
    }
}

# Clear DNS Cache
Write-Status "Clearing DNS Cache"
try {
    Write-Host "Flushing DNS cache..."
    ipconfig /flushdns | Out-Null
    Write-Host "DNS cache cleared" -ForegroundColor Green
} catch {
    Write-Error "Error clearing DNS cache: $_"
}

# Optimize Drives
Write-Status "Optimizing Drives"
try {
    Get-Volume | Where-Object { $_.DriveType -eq 'Fixed' } | ForEach-Object {
        $drive = $_
        if ($drive.DriveLetter) {
            Write-Host "Optimizing drive $($drive.DriveLetter)..."
            Optimize-Volume -DriveLetter $drive.DriveLetter -ReTrim -Verbose
            Write-Host "Drive $($drive.DriveLetter) optimization complete" -ForegroundColor Green
        }
    }
} catch {
    Write-Error "Error optimizing drives: $_"
}

Write-Host "`nOptimization completed!" -ForegroundColor Cyan
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
