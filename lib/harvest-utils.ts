import type {
  ResearchSource,
  DSpaceEndpoints,
  FetchOptions,
  Record as RecordType,
} from '@/lib/types'

export const USER_AGENT = 'Academic-Library-Harvester/3.4.0'
export const PAGE_SIZE_DEFAULT = 24
export const RECORDS_PER_REPOSITORY = 40
export const INCREMENTAL_RECORDS = 10

export const ELIS_PRIMARY = 'http://eprints.rclis.org/cgi/oai2'
export const ELIS_BACKUP = 'http://eprints.rclis.org/cgi/oai2'

export const DSPACE_ENDPOINTS: DSpaceEndpoints = {
  uct: 'https://open.uct.ac.za/oai/request',
  spu: 'https://openhub.spu.ac.za/oai/request',
  sun: 'https://scholar.sun.ac.za/server/oai/request',
  ufs: 'https://scholar.ufs.ac.za/server/oai/request',
  up: 'https://repository.up.ac.za/server/oai/request',
  unisa: 'https://uir.unisa.ac.za/server/oai/request',
  nwu: 'https://repository.nwu.ac.za/server/oai/request',
  wits: 'https://wiredspace.wits.ac.za/server/oai/request',
  cut: 'https://cutscholar.cut.ac.za/server/oai/request',
}

export const RESEARCH_DATA_SOURCES: ResearchSource[] = [
  {
    name: 'dryad',
    apiUrl: 'https://datadryad.org/api/v2/search',
    displayName: 'Dryad Digital Repository',
    params: '',
  },
  {
    name: 'zenodo',
    apiUrl: 'https://zenodo.org/api/records',
    displayName: 'Zenodo',
    params: '&sort=mostrecent',
  },
  {
    name: 'mendeley',
    apiUrl: 'https://api.datacite.org/dois',
    displayName: 'Mendeley Data',
    params: '&size=25',
  },
]

export const OPENALEX_LIVE_SOURCE: ResearchSource = {
  name: 'openalex',
  apiUrl: 'https://api.openalex.org/works',
  displayName: 'OpenAlex (Datasets)',
  params: '',
}

export function detectDryad(
  identifier: string = '',
  url: string = ''
): boolean {
  const id = (identifier || '').toLowerCase()
  const u = (url || '').toLowerCase()
  return (
    id.startsWith('10.5061/') ||
    id.startsWith('10.6071/') ||
    u.includes('datadryad.org')
  )
}

export function detectZenodo(
  identifier: string = '',
  url: string = ''
): boolean {
  const id = (identifier || '').toLowerCase()
  const u = (url || '').toLowerCase()
  return (
    id.startsWith('10.5281/') ||
    id.includes('zenodo') ||
    u.includes('zenodo.org')
  )
}

export function detectMendeley(
  identifier: string = '',
  url: string = ''
): boolean {
  const id = (identifier || '').toLowerCase()
  const u = (url || '').toLowerCase()
  return id.startsWith('10.17632/') || u.includes('data.mendeley.com')
}

export function sourceMap(id: string): string {
  const map: Record<string, string> = {
    uct: 'University of Cape Town',
    spu: 'Sol Plaatje University',
    sun: 'Stellenbosch University',
    ufs: 'University of Free State',
    up: 'University of Pretoria',
    unisa: 'University of South Africa',
    nwu: 'North-West University',
    wits: 'University of Witwatersrand',
    cut: 'Central University of Technology',
    elis: 'E-LIS e-prints in Library and Information Science',
  }
  return map[id] || id.toUpperCase()
}

export function repositoryBaseUrl(id: string): string {
  const map: Record<string, string> = {
    uct: 'https://open.uct.ac.za',
    spu: 'https://openhub.spu.ac.za',
    sun: 'https://scholar.sun.ac.za',
    ufs: 'https://scholar.ufs.ac.za',
    up: 'https://repository.up.ac.za',
    unisa: 'https://uir.unisa.ac.za',
    nwu: 'https://repository.nwu.ac.za',
    wits: 'https://wiredspace.wits.ac.za',
    cut: 'https://cutscholar.cut.ac.za',
    elis: 'http://eprints.rclis.org',
  }
  return map[id] || ''
}

export function buildRecordUrl(repositoryId: string, identifier: string): string {
  if (!identifier || !repositoryId) return ''

  // Handle different identifier formats
  const cleanId = identifier.replace(/^oai:/i, '').replace(/^[^:]+:/, '')

  // E-LIS URLs are already full URLs
  if (repositoryId === 'elis') {
    if (/^https?:\/\//i.test(identifier)) {
      return identifier
    }
    return `http://eprints.rclis.org/${cleanId}/`
  }

  // Handle-based URLs (DSpace repositories)
  if (/^https?:\/\/hdl\.handle\.net\//i.test(identifier)) {
    return identifier
  }

  // DOI-based URLs
  if (/^10\.\d{4}\//i.test(cleanId)) {
    return `https://doi.org/${cleanId}`
  }

  // DSpace OAI identifiers: oai:{repo}:{id}
  if (/^oai:/i.test(identifier)) {
    const parts = cleanId.split(':')
    if (parts.length >= 2) {
      const repoId = parts[0]
      const recordId = parts[1]
      const baseUrl = repositoryBaseUrl(repoId)
      if (baseUrl) {
        return `${baseUrl}/handle/${repoId}/${recordId}`
      }
    }
  }

  // Try to construct URL from repository base
  const baseUrl = repositoryBaseUrl(repositoryId)
  if (baseUrl && cleanId) {
    return `${baseUrl}/handle/${repositoryId}/${cleanId}`
  }

  return ''
}

export const pick = (arr?: string[]): string => arr?.[0] || ''

export const year = (d?: string | number): number | undefined => {
  if (!d) return undefined
  const match = String(d).match(/\b(\d{4})\b/)
  return match ? parseInt(match[1]) : undefined
}

export const stripHtml = (s: string): string =>
  String(s || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export function decode(s: string): string {
  return String(s || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

export function rid(): string {
  const array = new Uint8Array(8)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return [...array].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function createRecordSignature(record: RecordType): string {
  const title = (record.title || '').trim().toLowerCase()
  const authors = Array.isArray(record.authors)
    ? record.authors.join(',').toLowerCase()
    : String(record.authors || '').toLowerCase()
  const source = (record.source || '').toLowerCase()
  const yearVal = record.year || ''
  const identifier = record.identifier || ''

  if (identifier) {
    return `${source}-${identifier}`.toLowerCase()
  }

  return `${source}-${title}-${authors}-${yearVal}`.toLowerCase()
}

export function accumulativeDedupe(arr: RecordType[]): RecordType[] {
  const seen = new Set<string>()
  const unique: RecordType[] = []

  for (const r of arr) {
    if (!r.id) continue

    const signature = createRecordSignature(r)

    if (!seen.has(signature)) {
      seen.add(signature)
      unique.push(r)
    }
  }

  return unique
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
  retries: number = 2,
  backoffMs: number = 800
): Promise<string | null> {
  let attempt = 0
  let lastError: Error | null = null

  while (attempt <= retries) {
    try {
      const res = await fetch(url, {
        method: options.method || 'GET',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/xml,text/xml,application/json;q=0.9,*/*;q=0.8',
          ...(options.headers || {}),
        },
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`)
      }

      const text = await res.text()

      if (/^\s*<!DOCTYPE html>|<html[\s>]/i.test(text)) {
        console.log(
          '   fetchWithRetry warning: HTML content received from',
          url
        )
      }

      return text
    } catch (err) {
      lastError = err as Error
      console.log(
        `   fetchWithRetry error (attempt ${attempt + 1}/${retries + 1}):`,
        lastError.message
      )
      if (attempt === retries) break
      await sleep(backoffMs * (attempt + 1))
      attempt++
    }
  }

  if (lastError) {
    console.log('   fetchWithRetry giving up:', lastError.message)
  }
  return null
}

export async function fetchJSON<T = any>(
  url: string,
  options: FetchOptions = {},
  retries: number = 2
): Promise<T | null> {
  const text = await fetchWithRetry(
    url,
    {
      ...options,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    },
    retries
  )

  if (!text) return null

  if (/^\s*<!DOCTYPE html>|<html[\s>]/i.test(text)) {
    console.error('   fetchJSON got HTML instead of JSON from', url)
    return null
  }

  try {
    return JSON.parse(text) as T
  } catch (e) {
    console.error('   Failed to parse JSON from', url, (e as Error).message)
    return null
  }
}
