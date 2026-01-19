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
        {/* Search Bar */}
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Search by keyword, title, or author (use quotes "" for exact matches)...'
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
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
