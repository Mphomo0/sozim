const TITLE_SUFFIX = ' | Sozim' // appended by the root layout title template
const MAX_TITLE = 60
const MIN_DESC = 110
const MAX_DESC = 160

function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max - 1).replace(/[,;:.\s]+$/, '')}…`
}

/** Strip HTML tags and markdown syntax so body content can seed a meta description. */
export function stripMarkup(text: string): string {
  return normalize(
    text
      .replace(/<[^>]+>/g, ' ')
      .replace(/[#*_`>\[\]()!-]/g, ' '),
  )
}

/**
 * Page title for use with the root layout's `%s | Sozim` template.
 * Clamped so the final rendered title stays within 60 characters.
 */
export function metaTitle(raw: string): string {
  return truncateAtWord(normalize(raw), MAX_TITLE - TITLE_SUFFIX.length)
}

/**
 * Meta description clamped to the 110–160 character window.
 * Falls back to `fallback` when `raw` is empty/whitespace; pads with
 * `filler` when the result is too short.
 */
export function metaDescription(
  raw: string | undefined | null,
  fallback: string,
  filler = 'Accredited education and training at Sozim College, Bloemfontein, South Africa.',
): string {
  let text = normalize(raw || '') || normalize(fallback)
  if (text.length > MAX_DESC) text = truncateAtWord(text, MAX_DESC)
  if (text.length < MIN_DESC) {
    const joined = normalize(`${text.replace(/[.\s]+$/, '')}. ${filler}`)
    text = joined.length > MAX_DESC ? truncateAtWord(joined, MAX_DESC) : joined
  }
  return text
}
