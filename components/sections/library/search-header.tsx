'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

type CategoryType = 'all' | 'research' | 'articles' | 'theses' | 'elis'

interface SearchHeaderProps {
  onSearch: (query: string, category: CategoryType) => void
  loading?: boolean
}

export function SearchHeader({ onSearch, loading = false }: SearchHeaderProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all')

  const handleSearch = () => {
    onSearch(query, activeCategory)
  }

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category)
    onSearch(query, category)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Bar — stacked on mobile, unified bar on tablet+ */}

        {/* Mobile */}
        <div className="flex flex-col gap-3 sm:hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Search by keyword, title, or author...'
            className="w-full h-12 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full h-12 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Tablet + Desktop */}
        <div className="hidden sm:flex h-14 items-stretch border border-gray-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <div className="flex items-center pl-5 text-gray-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Search by keyword, title, or author (use "" for exact matches)...'
            className="flex-1 min-w-0 px-4 text-sm bg-transparent focus:outline-none disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-semibold shrink-0 border-l border-gray-200 transition-colors flex items-center gap-2"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={() => handleCategoryChange('all')}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'all'
                ? 'bg-blue-900 hover:bg-blue-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            All Sources
          </Button>
          <Button
            onClick={() => handleCategoryChange('research')}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'research'
                ? 'bg-red-700 hover:bg-red-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Research Data
          </Button>
          <Button
            onClick={() => handleCategoryChange('articles')}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'articles'
                ? 'bg-blue-900 hover:bg-blue-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Journal Articles
          </Button>
          <Button
            onClick={() => handleCategoryChange('theses')}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'theses'
                ? 'bg-blue-900 hover:bg-blue-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Theses
          </Button>
          <Button
            onClick={() => handleCategoryChange('elis')}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === 'elis'
                ? 'bg-blue-900 hover:bg-blue-800 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            E-LIS Repository
          </Button>
        </div>
      </div>
    </div>
  )
}
