export type RecordCategory = 'thesis' | 'article' | 'research'

export type RecordType =
  | 'Thesis/Dissertation'
  | 'Journal Article'
  | 'Research Data'
  | 'Other'

export type IdentifierType =
  | 'Handle'
  | 'DOI'
  | 'Dryad ID'
  | 'Zenodo ID'
  | 'OpenAlex ID'
  | 'ID'
  | ''

export interface Record {
  id: string
  title: string
  authors: string[]
  description: string
  keywords: string[]
  year?: number
  source: string
  type: RecordType
  identifier: string
  identifierType: IdentifierType
  url: string
  category?: RecordCategory
  createdAt?: Date
  updatedAt?: Date
}

export interface MetaData {
  key: string
  lastUpdated: Date
  counts: {
    theses: number
    articles: number
    research: number
    total: number
  }
  lastHarvest?: Date
  lastError?: {
    context: string
    message: string
    time: Date
  }
}

export interface ResearchSource {
  name: string
  apiUrl: string
  displayName: string
  params: string
}

export interface DSpaceEndpoints {
  [key: string]: string
}

export interface OAIParseResult {
  records: Record[]
  next: string | null
}

export interface SearchQueryParsed {
  phrases: string[]
  tokens: string[]
  raw: string
}

export interface Facets {
  years: FacetItem[]
  authors: FacetItem[]
  repositories: FacetItem[]
  types: FacetItem[]
}

export interface FacetItem {
  name: string | number
  count: number
}

export interface HarvestFilters {
  year?: string | number
  repository?: string
  type?: string
  author?: string
}

export interface HarvestRequest {
  category?: 'all' | 'theses' | 'articles' | 'research'
  query?: string
  page?: number
  pageSize?: number
  filters?: HarvestFilters
}

export interface HarvestResponse {
  success: boolean
  results: Record[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  facets: Facets
}

export interface ElisSearchResult {
  results: Record[]
  endpointUsed: string | null
}

export interface OpenAlexDatasetResult {
  records: Record[]
  total: number
  hasMore: boolean
}

export interface FetchOptions {
  method?: string
  headers?: { [key: string]: string }
}

export interface BestIdResult {
  identifier: string
  identifierType: IdentifierType
  url: string
}

export interface HarvestResult {
  t: Record[]
  a: Record[]
}

export interface ScoredRecord {
  record: Record
  score: number
}

export interface HealthResponse {
  ok: boolean
  service: string
  version: string
  timestamp: string
  repositories: {
    academic: number
    research_data: number
    includes_elis: boolean
    includes_openalex_live: boolean
  }
  data: {
    total_records: number
    theses: number
    articles: number
    research: number
  }
  meta: MetaData | object
  harvest: {
    last_harvest: string
    next_harvest: string
  }
}

export interface ErrorResponse {
  success: false
  error: string
}

export interface IncrementalHarvestResponse {
  success: boolean
  message: string
  newRecords: number
  category: string
  timestamp: string
}

export interface RISExportRequest {
  records: Record[]
}

export interface ElisEndpointChoice {
  endpoint: string | null
  used: 'primary' | 'backup' | null
}
