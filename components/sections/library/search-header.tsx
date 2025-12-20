'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SearchHeader() {
  return (
    <div className="bg-white border-b border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder='Search by keyword, title, or author (use quotes "" for exact matches)...'
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button className="bg-gray-600 hover:bg-gray-700 text-white px-6">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Category Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-full text-sm">
            All Sources
          </Button>
          <Button className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-full text-sm">
            Research Data
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-full text-sm">
            Journal Articles
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-full text-sm">
            Theses
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-full text-sm">
            E-LIS Repository
          </Button>
        </div>
      </div>
    </div>
  )
}
