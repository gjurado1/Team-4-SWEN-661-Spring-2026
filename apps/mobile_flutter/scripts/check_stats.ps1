# scripts/check_stats.ps1
$ErrorActionPreference = "Stop"

Write-Host "Running tests (with coverage)..."
flutter test --coverage | Tee-Object -FilePath test_output.txt | Out-Null

Write-Host "----------------------------------"

# --- Test summary (Total/Passed/Failed) ---
$summaryLine = Select-String -Path test_output.txt -Pattern "\+\d+\s+-\d+" | Select-Object -Last 1

$passed = 0
$failed = 0

if ($summaryLine) {
  $m = [regex]::Match($summaryLine.Line, "\+(\d+)\s+-\s*(\d+)")
  if ($m.Success) {
    $passed = [int]$m.Groups[1].Value
    $failed = [int]$m.Groups[2].Value
  }
}

$total = $passed + $failed

# --- Coverage summary (Covered/Total Lines) ---
$lcovPath = Join-Path (Get-Location) "coverage\lcov.info"
if (!(Test-Path $lcovPath)) {
  Write-Host "Total Tests: $total"
  Write-Host "Passed:      $passed"
  Write-Host "Failed:      $failed"
  Write-Host "Coverage:    (no coverage\lcov.info found)"
  Write-Host "----------------------------------"
  exit 0
}

$lcovLines = Get-Content $lcovPath

# LF = lines found, LH = lines hit (covered)
$totalLines = 0
$coveredLines = 0

foreach ($line in $lcovLines) {
  if ($line -match "^LF:(\d+)") { $totalLines += [int]$matches[1] }
  elseif ($line -match "^LH:(\d+)") { $coveredLines += [int]$matches[1] }
}

$coveragePct = 0
if ($totalLines -gt 0) {
  $coveragePct = [math]::Round(($coveredLines / $totalLines) * 100, 2)
}

Write-Host "Total Tests: $total"
Write-Host "Passed:      $passed"
Write-Host "Failed:      $failed"
Write-Host "Total Lines: $totalLines"
Write-Host "Covered:     $coveredLines"
Write-Host "Coverage:    $coveragePct%"
Write-Host "----------------------------------"

if ($coveragePct -lt 60) {
  Write-Host "WARNING: Coverage is below 60% requirement."
}
