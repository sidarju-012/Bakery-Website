Place your product images in this folder using these exact filenames:

- belgian-coverture-chocolate-cake.jpg
- chocolate-fudge-coverture.jpg
- red-velvet-cake.jpg
- butter-cake-chocolate-chips.jpg
- pineapple-upside-down-cake.jpg
- mawa-tea-cake.jpg

These are referenced by `src/data/products.js`.

Quick import helper (Windows PowerShell):

Run this from the project root:

  powershell -NoProfile -ExecutionPolicy Bypass -File tools/import-product-images.ps1 `
    -MawaTeaCake "C:\path\to\mawa.jpg" `
    -PineappleUpsideDown "C:\path\to\pineapple.jpg" `
    -ButterCake "C:\path\to\butter.jpg" `
    -RedVelvet "C:\path\to\redvelvet.jpg" `
    -ChocolateFudge "C:\path\to\fudge.jpg" `
    -BelgianCoverture "C:\path\to\belgian.jpg"

