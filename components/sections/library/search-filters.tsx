'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface FilterState {
  year: string
  repository: string
  type: string
  author: string
}

interface SearchFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

export function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    year: true,
    repository: true,
    type: true,
    author: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ChevronDown className="w-5 h-5 text-blue-900" />
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
      </div>

      {/* Year Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('year')}
          className="flex items-center justify-between w-full mb-2"
        >
          <label className="text-sm font-semibold text-gray-900">Year</label>
          {expandedSections.year ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.year && (
          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Years</option>
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
          </select>
        )}
      </div>

      {/* Repository Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('repository')}
          className="flex items-center justify-between w-full mb-2"
        >
          <label className="text-sm font-semibold text-gray-900">
            Repository
          </label>
          {expandedSections.repository ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.repository && (
          <select
            value={filters.repository}
            onChange={(e) =>
              setFilters({ ...filters, repository: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Repositories</option>
            <option>Zenodo</option>
            <option>JSTOR</option>
            <option>PubMed</option>
          </select>
        )}
      </div>

      {/* Type Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('type')}
          className="flex items-center justify-between w-full mb-2"
        >
          <label className="text-sm font-semibold text-gray-900">Type</label>
          {expandedSections.type ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.type && (
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Types</option>
            <option>Journal Article</option>
            <option>Dataset</option>
            <option>Thesis</option>
          </select>
        )}
      </div>

      {/* Author Filter */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('author')}
          className="flex items-center justify-between w-full mb-2"
        >
          <label className="text-sm font-semibold text-gray-900">
            Author contains
          </label>
          {expandedSections.author ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.author && (
          <input
            type="text"
            placeholder="e.g. Smith"
            value={filters.author}
            onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* Apply Filters Button */}
      <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white">
        Apply Filters
      </Button>

      {/* System Info */}
      <div className="bg-gray-100 rounded p-4 text-sm space-y-1">
        <h3 className="font-semibold text-gray-900 mb-2">System Info</h3>
        <div className="text-gray-700">
          <div>
            <span className="font-medium">Records:</span> 1,768
          </div>
          <div>
            <span className="font-medium">Theses:</span> 702
          </div>
          <div>
            <span className="font-medium">Articles:</span> 575
          </div>
          <div>
            <span className="font-medium">Research Data:</span> 487
          </div>
          <div>
            <span className="font-medium">Last Harvest:</span> 15/11/2025,
            06:28:43
          </div>
          <div className="mt-2">
            <span className="font-medium">Includes E-LIS:</span>
            <span className="ml-1 text-green-600">✓</span>
          </div>
        </div>
      </div>
    </div>
  )
}
