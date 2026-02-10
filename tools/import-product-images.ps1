Param(
  [Parameter(Mandatory=$true)][string]$MawaTeaCake,
  [Parameter(Mandatory=$true)][string]$PineappleUpsideDown,
  [Parameter(Mandatory=$true)][string]$ButterCake,
  [Parameter(Mandatory=$true)][string]$RedVelvet,
  [Parameter(Mandatory=$true)][string]$ChocolateFudge,
  [Parameter(Mandatory=$true)][string]$BelgianCoverture
)

$ErrorActionPreference = "Stop"

function Copy-Image($Source, $DestName) {
  if (!(Test-Path -LiteralPath $Source)) {
    throw "Source file not found: $Source"
  }
  $destDir = Join-Path $PSScriptRoot "..\public\images\products"
  if (!(Test-Path -LiteralPath $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
  }

  $destPath = Join-Path $destDir $DestName
  Copy-Item -LiteralPath $Source -Destination $destPath -Force
  Write-Host "✅ Copied -> $destPath"
}

Write-Host "Placing product images into public/images/products/ ..."

# Order provided by you:
Copy-Image $MawaTeaCake "mawa-tea-cake.jpg"
Copy-Image $PineappleUpsideDown "pineapple-upside-down-cake.jpg"
Copy-Image $ButterCake "butter-cake-chocolate-chips.jpg"
Copy-Image $RedVelvet "red-velvet-cake.jpg"
Copy-Image $ChocolateFudge "chocolate-fudge-coverture.jpg"
Copy-Image $BelgianCoverture "belgian-coverture-chocolate-cake.jpg"

Write-Host "`nAll done. Refresh the site and the images should appear."


