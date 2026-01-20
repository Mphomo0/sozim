'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { ChevronLeft, ChevronRight, Database, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchFilters } from './search-filters'
import { ArticleGrid } from './article-grid'
import { Pagination } from '@/components/global/Pagination'
import { useLibrarySearch } from '@/lib/hooks/use-library-search'
import { useElisSearch } from '@/lib/hooks/use-elis-search'
import { useSelectedRecords } from '@/lib/hooks/use-selected-records'
import { downloadRIS } from '@/lib/api/download'
import { toast } from 'react-toastify'
import type { Record as RecordType } from '@/lib/types'

type CategoryType = 'all' | 'research' | 'articles' | 'theses' | 'elis'

export interface SearchLayoutProps {
  initialQuery?: string
  initialCategory?: CategoryType
}

export interface SearchLayoutRef {
  handleSearch: (query: string, category: CategoryType) => void
}

export interface SearchLayoutProps {
  initialQuery?: string
  initialCategory?: CategoryType
  noDataAction?: React.ReactNode
}

export const SearchLayout = forwardRef<SearchLayoutRef, SearchLayoutProps>(function SearchLayout({
  initialQuery = '',
  initialCategory = 'all',
  noDataAction,
}: SearchLayoutProps, ref) {
  const [filters, setFilters] = useState({
    year: '',
    repository: '',
    type: '',
    author: '',
  })

  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [currentCategory, setCurrentCategory] =
    useState<CategoryType>(initialCategory)

  // Main search hook
  const {
    records: mainRecords,
    total,
    page,
    hasMore,
    facets,
    loading: mainLoading,
    error: mainError,
    search,
    nextPage,
    prevPage,
  } = useLibrarySearch()

  // E-LIS search hook
  const {
    records: elisRecords,
    loading: elisLoading,
    error: elisError,
    search: searchElis,
  } = useElisSearch()

  // Selected records management
  const {
    selectedRecords,
    selectedCount,
    toggleRecord,
    selectAll,
    clearSelection,
    getSelectedRecords,
  } = useSelectedRecords()

  // Determine which records and loading state to use
  const isElisMode = currentCategory === 'elis'
  const displayRecords = isElisMode ? elisRecords : mainRecords
  const loading = isElisMode ? elisLoading : mainLoading
  const error = isElisMode ? elisError : mainError

  // Initial search on mount
  useEffect(() => {
    if (initialQuery || initialCategory !== 'all') {
      handleSearch(initialQuery, initialCategory)
    } else {
      // Load all records by default
      performMainSearch('', 'all', { year: '', repository: '', type: '', author: '' })
    }
  }, [])

  const performMainSearch = async (
    query: string,
    category: 'all' | 'research' | 'articles' | 'theses',
    searchFilters: typeof filters,
  ) => {
    await search({
      category,
      query,
      page: 1,
      pageSize: 10,
      filters: {
        year: searchFilters.year || undefined,
        repository: searchFilters.repository || undefined,
        type: searchFilters.type || undefined,
        author: searchFilters.author || undefined,
      },
    })
  }

  const handleSearch = async (query: string, category: CategoryType) => {
    setCurrentQuery(query)
    setCurrentCategory(category)
    clearSelection()

    if (category === 'elis') {
      if (!query || query.length < 2) {
        toast.error('Please enter at least 2 characters to search E-LIS')
        return
      }
      await searchElis({ query, page: 1, pageSize: 10 })
    } else {
      await performMainSearch(query, category as any, filters)
    }
  }

  const handleApplyFilters = async () => {
    if (currentCategory === 'elis') {
      toast.info('Filters are not available for E-LIS live search')
      return
    }
    await performMainSearch(currentQuery, currentCategory as any, filters)
  }

  const handleExportSelected = async () => {
    const selected = getSelectedRecords(displayRecords)
    if (selected.length === 0) {
      toast.error('No records selected')
      return
    }

    try {
      await downloadRIS(selected)
      toast.success(`Exported ${selected.length} records to RIS format`)
    } catch (err) {
      toast.error('Failed to export records')
      console.error(err)
    }
  }

  const handleSelectAll = () => {
    selectAll(displayRecords)
  }

  useImperativeHandle(ref, () => ({
    handleSearch,
  }))

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 lg:sticky lg:top-8 h-fit">
          <SearchFilters
            filters={filters}
            setFilters={setFilters}
            onApplyFilters={handleApplyFilters}
            facets={facets}
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {loading
                ? 'Searching...'
                : isElisMode
                  ? `${displayRecords.length} results from E-LIS`
                  : `${total.toLocaleString()} results found (page ${page})`}
            </div>
          </div>

          {/* No Data Action */}
          {!loading && displayRecords.length === 0 && noDataAction && (
            <div className="flex justify-center mb-6">{noDataAction}</div>
          )}

          {/* Articles Grid */}
          <ArticleGrid
            records={displayRecords}
            loading={loading}
            selectedRecords={selectedRecords}
            onToggleRecord={toggleRecord}
            onSelectAll={handleSelectAll}
            onClearSelection={clearSelection}
            onExportSelected={handleExportSelected}
          />

          {/* Pagination - Only for main search */}
          {!isElisMode && !loading && displayRecords.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(total / 10)}
              onPageChange={(newPage) => search({ category: currentCategory, query: currentQuery, page: newPage, pageSize: 10, filters })}
              limit={10}
            />
          )}
        </div>
      </div>
    </div>
  )
})

SearchLayout.displayName = 'SearchLayout'
