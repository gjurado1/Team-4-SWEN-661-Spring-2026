Write-Host "Running Flutter tests with coverage..."
flutter test --coverage

$lcovFile = "coverage/lcov.info"

if (!(Test-Path $lcovFile)) {
    Write-Host "Coverage file not found!"
    exit 1
}

Write-Host ""
Write-Host "Calculating coverage..."

$totalLines = (Select-String "^DA:" $lcovFile).Count
$coveredLines = (Select-String "^DA:.*\,1$" $lcovFile).Count

if ($totalLines -eq 0) {
    Write-Host "No coverage data found."
    exit 1
}

$coverage = [math]::Round(($coveredLines / $totalLines) * 100, 2)

Write-Host "----------------------------------"
Write-Host "Total Lines:    $totalLines"
Write-Host "Covered Lines:  $coveredLines"
Write-Host "Coverage:       $coverage%"
Write-Host "----------------------------------"

if ($coverage -lt 60) {
    Write-Host "WARNING: Coverage is below 60% requirement."
} else {
    Write-Host "SUCCESS: Coverage meets 60% requirement."
}
