$ErrorActionPreference = "Stop"

# Creates an Elastic Beanstalk-ready ZIP where package.json/Procfile are at the ZIP root.
# Usage (from project root):
#   powershell -ExecutionPolicy Bypass -File .\tools\package-eb-backend.ps1

$projectRoot = (Resolve-Path "$PSScriptRoot\..").Path
$backendRoot = Join-Path $projectRoot "happy-oven-backend"
$outDir = Join-Path $projectRoot "dist-eb"
$zipPath = Join-Path $outDir "happy-oven-backend-eb.zip"

New-Item -ItemType Directory -Force -Path $outDir | Out-Null
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$required = @(
  "routes",
  "models",
  "package.json",
  "package-lock.json",
  "Procfile",
  "app.js"
)
foreach ($item in $required) {
  $p = Join-Path $backendRoot $item
  if (!(Test-Path $p)) {
    throw "Missing required '$item' at backend root: $p"
  }
}

Push-Location $backendRoot
try {
  # Compress-Archive needs the items passed as paths; this ensures ZIP root contains these files/folders directly.
  Compress-Archive -Path @(
    ".\routes",
    ".\models",
    ".\package.json",
    ".\package-lock.json",
    ".\Procfile",
    ".\app.js"
  ) -DestinationPath $zipPath -Force
} finally {
  Pop-Location
}

Write-Host "✅ Created Elastic Beanstalk bundle:" $zipPath
Write-Host "Upload THIS zip to Elastic Beanstalk."


