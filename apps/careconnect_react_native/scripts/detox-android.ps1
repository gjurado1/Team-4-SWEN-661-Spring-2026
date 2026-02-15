param(
  [string]$Configuration = "android.emu.debug",
  [int]$MetroPort = 8081
)

$ErrorActionPreference = "Stop"

function Test-PortOpen {
  param(
    [string]$HostName,
    [int]$Port,
    [int]$TimeoutMs = 500
  )

  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $iar = $client.BeginConnect($HostName, $Port, $null, $null)
    $ok = $iar.AsyncWaitHandle.WaitOne($TimeoutMs, $false)
    if (-not $ok) {
      return $false
    }
    $client.EndConnect($iar) | Out-Null
    return $true
  }
  catch {
    return $false
  }
  finally {
    $client.Close()
  }
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$metroProcess = $null
$metroStdoutLogPath = Join-Path $projectRoot "artifacts/metro-detox.stdout.log"
$metroStderrLogPath = Join-Path $projectRoot "artifacts/metro-detox.stderr.log"

Push-Location $projectRoot
try {
  New-Item -ItemType Directory -Force (Join-Path $projectRoot "artifacts") | Out-Null
  if (Test-Path $metroStdoutLogPath) {
    Remove-Item $metroStdoutLogPath -Force
  }
  if (Test-Path $metroStderrLogPath) {
    Remove-Item $metroStderrLogPath -Force
  }

  Write-Host "Starting Expo Metro on port $MetroPort..."
  $metroProcess = Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c npx expo start --dev-client --clear --port $MetroPort" `
    -WorkingDirectory $projectRoot `
    -PassThru `
    -RedirectStandardOutput $metroStdoutLogPath `
    -RedirectStandardError $metroStderrLogPath

  $maxWaitSeconds = 120
  $ready = $false
  for ($i = 0; $i -lt $maxWaitSeconds; $i++) {
    if ($metroProcess.HasExited) {
      throw "Metro process exited early. Check $metroStdoutLogPath and $metroStderrLogPath"
    }

    if (Test-PortOpen -HostName "127.0.0.1" -Port $MetroPort) {
      $ready = $true
      break
    }

    Start-Sleep -Seconds 1
  }

  if (-not $ready) {
    throw "Metro did not become ready on port $MetroPort within $maxWaitSeconds seconds. Check $metroStdoutLogPath and $metroStderrLogPath"
  }

  Write-Host "Metro is ready. Building Detox app for $Configuration..."
  & npx detox build -c $Configuration
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }

  Write-Host "Running Detox tests for $Configuration..."
  & npx detox test -c $Configuration --record-logs all
  exit $LASTEXITCODE
}
finally {
  if ($metroProcess -and -not $metroProcess.HasExited) {
    Write-Host "Stopping Metro (PID $($metroProcess.Id))..."
    & taskkill /PID $metroProcess.Id /T /F | Out-Null
  }
  Pop-Location
}
