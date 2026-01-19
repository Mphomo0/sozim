import type {
  Record as RecordType,
  HarvestRequest,
  HarvestResponse,
  HealthResponse,
  Facets,
} from '@/lib/types'
import { api } from './client'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

export interface SearchParams {
  category?: 'all' | 'theses' | 'articles' | 'research'
  query?: string
  page?: number
  pageSize?: number
  filters?: {
    year?: string
    repository?: string
    type?: string
    author?: string
  }
}

export interface ElisSearchParams {
  query: string
  page?: number
  pageSize?: number
}

export interface ResearchLiveSearchParams {
  query: string
  page?: number
  pageSize?: number
}

export const libraryApi = {
  // Main harvest/search endpoint
  search: async (params: SearchParams): Promise<HarvestResponse> => {
    return api.post<HarvestResponse>('/harvest', params)
  },

  // E-LIS live search
  searchElis: async (params: ElisSearchParams) => {
    return api.post('/elis-live-search', params)
  },

  // OpenAlex live search
  searchResearchLive: async (params: ResearchLiveSearchParams) => {
    return api.post('/research-live', params)
  },

  // Export records as RIS
  exportRIS: async (records: RecordType[]): Promise<Blob> => {
    const response = await fetch(`${API_BASE}/ris`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records }),
    })

    if (!response.ok) {
      throw new Error('RIS export failed')
    }

    return response.blob()
  },

  // Get system health/stats
  getHealth: async (): Promise<HealthResponse> => {
    return api.get<HealthResponse>('/health')
  },

  // Trigger incremental harvest
  harvestIncremental: async (category: string = 'all') => {
    return api.post('/harvest-incremental', { category })
  },

  // Trigger manual harvest
  harvestNow: async () => {
    return api.post('/harvest-now')
  },
}
