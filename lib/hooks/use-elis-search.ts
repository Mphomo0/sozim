import { useState, useCallback } from 'react'
import { libraryApi, type ElisSearchParams } from '@/lib/api/library'
import type { Record as RecordType } from '@/lib/types'

interface UseElisSearchResult {
  records: RecordType[]
  total: number
  loading: boolean
  error: string | null
  search: (params: ElisSearchParams) => Promise<void>
  endpointUsed: string | null
}

export function useElisSearch(): UseElisSearchResult {
  const [records, setRecords] = useState<RecordType[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [endpointUsed, setEndpointUsed] = useState<string | null>(null)

  const search = useCallback(async (params: ElisSearchParams) => {
    if (!params.query || params.query.length < 2) {
      setError('Please enter at least 2 characters to search E-LIS')
      setRecords([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await libraryApi.searchElis(params) as {
        results: RecordType[]
        total: number
        endpoint_used?: string | null
      }
      setRecords(response.results)
      setTotal(response.total)
      setEndpointUsed(response.endpoint_used || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'E-LIS search failed')
      setRecords([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    records,
    total,
    loading,
    error,
    search,
    endpointUsed,
  }
}
