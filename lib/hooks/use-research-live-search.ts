import { useState, useCallback } from 'react'
import { libraryApi, type ResearchLiveSearchParams } from '@/lib/api/library'
import type { Record as RecordType } from '@/lib/types'

interface UseResearchLiveSearchResult {
  records: RecordType[]
  total: number
  hasMore: boolean
  loading: boolean
  error: string | null
  search: (params: ResearchLiveSearchParams) => Promise<void>
}

export function useResearchLiveSearch(): UseResearchLiveSearchResult {
  const [records, setRecords] = useState<RecordType[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (params: ResearchLiveSearchParams) => {
    if (!params.query) {
      setError('Query is required for research live search')
      setRecords([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await libraryApi.searchResearchLive(params) as {
        results: RecordType[]
        total: number
        hasMore: boolean
      }
      setRecords(response.results)
      setTotal(response.total)
      setHasMore(response.hasMore)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Research live search failed',
      )
      setRecords([])
      setTotal(0)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    records,
    total,
    hasMore,
    loading,
    error,
    search,
  }
}
