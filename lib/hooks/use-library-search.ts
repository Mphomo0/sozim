import { useState, useCallback, useEffect } from 'react'
import { libraryApi, type SearchParams } from '@/lib/api/library'
import type { Record as RecordType, Facets } from '@/lib/types'

interface UseLibrarySearchResult {
  records: RecordType[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
  facets: Facets | null
  loading: boolean
  error: string | null
  search: (params: SearchParams) => Promise<void>
  nextPage: () => void
  prevPage: () => void
  setPage: (page: number) => void
}

export function useLibrarySearch(
  initialParams: SearchParams = {},
): UseLibrarySearchResult {
  const [records, setRecords] = useState<RecordType[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(24)
  const [hasMore, setHasMore] = useState(false)
  const [facets, setFacets] = useState<Facets | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<SearchParams>(initialParams)

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await libraryApi.search({
        ...params,
        page: params.page || 1,
        pageSize: params.pageSize || 24,
      })

      setRecords(response.results)
      setTotal(response.total)
      setPage(response.page)
      setHasMore(response.hasMore)
      setFacets(response.facets)
      setSearchParams(params)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setRecords([])
      setTotal(0)
      setFacets(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const nextPage = useCallback(() => {
    if (hasMore) {
      search({ ...searchParams, page: page + 1 })
    }
  }, [hasMore, page, searchParams, search])

  const prevPage = useCallback(() => {
    if (page > 1) {
      search({ ...searchParams, page: page - 1 })
    }
  }, [page, searchParams, search])

  const setPageNumber = useCallback(
    (newPage: number) => {
      search({ ...searchParams, page: newPage })
    },
    [searchParams, search],
  )

  return {
    records,
    total,
    page,
    pageSize,
    hasMore,
    facets,
    loading,
    error,
    search,
    nextPage,
    prevPage,
    setPage: setPageNumber,
  }
}
