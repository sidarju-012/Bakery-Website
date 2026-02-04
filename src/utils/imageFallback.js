export function onImgError(fallbackSrc) {
  return (e) => {
    const img = e.currentTarget
    const state = img.dataset.fallbackState || '0'

    // First fallback: use provided fallbackSrc (usually a remote URL)
    if (state === '0' && fallbackSrc) {
      img.dataset.fallbackState = '1'
      img.src = fallbackSrc
      return
    }

    // Final fallback: local placeholder
    if (state !== '2') {
      img.dataset.fallbackState = '2'
      img.src = '/images/placeholder-product.svg'
    }
  }
}


