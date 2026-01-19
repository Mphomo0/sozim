'use client'

import PageHeader from '@/components/global/PageHeader'
import { SearchHeader } from '@/components/sections/library/search-header'
import { SearchLayout, type SearchLayoutRef } from '@/components/sections/library/search-layout'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Database, AlertTriangle } from 'lucide-react'
import { toast } from 'react-toastify'

type CategoryType = 'all' | 'research' | 'articles' | 'theses' | 'elis'

export default function LibraryPage() {
  const searchLayoutRef = useRef<SearchLayoutRef>(null)
  const [harvesting, setHarvesting] = useState(false)
  const [harvestStatus, setHarvestStatus] = useState<'idle' | 'harvesting' | 'error' | 'success'>('idle')

  const handleSearch = (query: string, category: CategoryType) => {
    searchLayoutRef.current?.handleSearch(query, category)
  }

  const handleHarvestNow = async () => {
    setHarvesting(true)
    setHarvestStatus('harvesting')
    try {
      const response = await fetch('/api/harvest-now', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setHarvestStatus('success')
        toast.success('Library data loaded successfully!')
        setTimeout(() => {
          searchLayoutRef.current?.handleSearch('', 'all')
        }, 1000)
      } else {
        setHarvestStatus('error')
        toast.error(data.error || 'Failed to load library data')
      }
    } catch (err) {
      setHarvestStatus('error')
      toast.error('Failed to load library data. Please try again.')
    } finally {
      setHarvesting(false)
      setTimeout(() => setHarvestStatus('idle'), 5000)
    }
  }

  return (
    <>
      <PageHeader
        title="Academic Library"
        details="Access thousands of scholarly articles, theses, and research data from leading South African universities and international repositories."
      />
      <SearchHeader onSearch={handleSearch} />
      <SearchLayout
        ref={searchLayoutRef}
        noDataAction={
          <div className="max-w-md mx-auto text-center space-y-6 py-8">
            <Database className="w-16 h-16 mx-auto text-blue-900 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Library Database is Empty
            </h3>
            <p className="text-gray-600 mb-6">
              No articles, theses, or research data have been loaded yet. Load the library to access thousands of academic resources.
            </p>
            {harvestStatus === 'harvesting' && (
              <div className="flex items-center justify-center gap-3 text-blue-600 mb-6">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Harvesting data from repositories...</span>
              </div>
            )}
            {harvestStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 mb-6 bg-red-50 px-4 py-3 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>Harvesting failed. Please try again.</span>
              </div>
            )}
            {harvestStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 mb-6 bg-green-50 px-4 py-3 rounded-lg">
                <Database className="w-5 h-5" />
                <span>Data loaded successfully! Searching...</span>
              </div>
            )}
            <Button
              onClick={handleHarvestNow}
              disabled={harvesting}
              className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {harvesting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Harvesting...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" />
                  Load Library Data
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              This will fetch approximately 360 records from multiple repositories. It may take 30-60 seconds.
            </p>
          </div>
        }
      />
    </>
  )
}
