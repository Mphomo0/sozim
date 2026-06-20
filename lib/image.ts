const IMAGEKIT_HOST = 'ik.imagekit.io'

export function optimizedImageUrl(url: string | undefined, width: number): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    if (parsed.hostname !== IMAGEKIT_HOST) return url
    parsed.searchParams.set('tr', `w-${width},f-webp`)
    return parsed.toString()
  } catch {
    return url
  }
}
