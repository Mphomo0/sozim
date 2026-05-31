export function hashContent(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return Math.abs(hash).toString(36)
}

export function splitIntoChunks(text: string, maxLength = 1000): string[] {
  if (!text.trim()) return []
  if (text.length <= maxLength) return [text.trim()]

  const chunks: string[] = []
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text]

  let current = ''
  for (const sentence of sentences) {
    const trimmed = sentence.trim()
    if (!trimmed) continue

    if ((current + ' ' + trimmed).length > maxLength && current.length > 0) {
      chunks.push(current.trim())
      current = trimmed
    } else {
      current = current ? current + ' ' + trimmed : trimmed
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks
}

export function computePageType(url: string): "page" | "blog" | "service" | "product" | "faq" | "other" {
  const path = new URL(url).pathname.toLowerCase()

  if (path.includes('/news/') || path.includes('/blog/')) return "blog"
  if (path.includes('/courses/') || path.includes('/services/') || path.includes('/academic')) return "service"
  if (path.includes('/shop/') || path.includes('/store/') || path.includes('/product/') || path.includes('/favorites')) return "product"
  if (path.includes('/faq')) return "faq"
  if (path === '/' || path === '/about' || path === '/contact' || path === '/campus' || path === '/career-pathway' || path === '/contact-learning' || path === '/privacy-policy' || path === '/terms-of-service' || path === '/welcome-message' || path === '/library' || path === '/apply' || path === '/call-me-back' || path === '/portal') return "page"

  return "other"
}

export function extractCleanText(element: any): string {
  if (!element) return ''
  if (typeof element === 'string') return element.trim()
  if (element.nodeType === 3) return (element.textContent || '').trim()

  const tag = element.tagName?.toLowerCase()
  if (!tag) return ''

  const skipTags = new Set(['script', 'style', 'noscript', 'iframe', 'svg', 'nav', 'footer', 'header'])
  if (skipTags.has(tag)) return ''

  const role = element.getAttribute?.('role')?.toLowerCase()
  if (role === 'navigation' || role === 'banner') return ''

  if (element.classList?.contains?.('cookie') || element.classList?.contains?.('banner')) return ''

  if (tag === 'br') return '\n'
  if (tag === 'p' || tag === 'div' || tag === 'h1' || tag === 'h2' || tag === 'h3' ||
      tag === 'h4' || tag === 'h5' || tag === 'h6' || tag === 'li' || tag === 'tr') {
    const parts: string[] = []
    for (const child of element.childNodes || []) {
      const text = extractCleanText(child)
      if (text) parts.push(text)
    }
    return parts.join(' ') + '\n'
  }

  const parts: string[] = []
  for (const child of element.childNodes || []) {
    const text = extractCleanText(child)
    if (text) parts.push(text)
  }
  return parts.join(' ')
}

export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
  'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then',
  'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'because', 'but', 'and', 'or', 'if', 'while', 'that', 'this',
  'these', 'those', 'it', 'its', 'what', 'which', 'who', 'whom',
  'i', 'me', 'my', 'myself', 'we', 'us', 'our', 'ours', 'ourselves',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
  'himself', 'she', 'her', 'hers', 'herself', 'they', 'them', 'their',
  'theirs', 'themselves', 'please', 'about',
])

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}
