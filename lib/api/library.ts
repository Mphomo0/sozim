import { convexClient } from '@/lib/convex-client'
import { api } from '@/convex/_generated/api'
import type { Record as RecordType, HarvestResponse, Facets } from '@/lib/types'

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
  search: async (params: SearchParams): Promise<HarvestResponse> => {
    const result = await convexClient.query(api.records.getRecords, {
      category: params.category,
      query: params.query,
      page: params.page || 1,
      pageSize: params.pageSize || 24,
      filters: params.filters,
    })
    return {
      results: result.results || [],
      total: result.total || 0,
      page: result.page || 1,
      pageSize: result.pageSize || 24,
      hasMore: result.hasMore || false,
      facets: result.facets || null,
    }
  },

  searchElis: async (params: ElisSearchParams) => {
    return convexClient.query(api.records.searchElis, {
      query: params.query,
      page: params.page || 1,
      pageSize: params.pageSize || 24,
    })
  },

  searchResearchLive: async (params: ResearchLiveSearchParams) => {
    return convexClient.query(api.records.searchResearchLive, {
      query: params.query,
      page: params.page || 1,
      pageSize: params.pageSize || 24,
    })
  },

  exportRIS: async (records: RecordType[]): Promise<Blob> => {
    const response = await fetch('/api/ris', {
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

  getHealth: async () => {
    const meta = await convexClient.query(api.records.getLibraryMeta, { key: 'main' })
    return {
      ok: true,
      service: 'library',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      repositories: {
        academic: 9,
        research_data: 3,
        includes_elis: true,
        includes_openalex_live: false,
      },
      data: {
        total_records: meta?.counts?.total || 0,
        theses: meta?.counts?.theses || 0,
        articles: meta?.counts?.articles || 0,
        research: meta?.counts?.research || 0,
      },
      harvest: {
        last_harvest: meta?.lastHarvest ? new Date(meta.lastHarvest).toISOString() : 'Never',
        next_harvest: 'Not scheduled',
      },
    }
  },

  harvestIncremental: async (category: string = 'all') => {
    return convexClient.action(api.records.harvestIncremental, { category })
  },

  harvestNow: async () => {
    return convexClient.action(api.records.harvestFull, {})
  },
}
