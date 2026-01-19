'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useSystemHealth } from '@/lib/hooks/use-system-health'
import type { Facets } from '@/lib/types'

interface FilterState {
  year: string
  repository: string
  type: string
  author: string
}

interface SearchFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  onApplyFilters: () => void
  facets?: Facets | null
  loading?: boolean
}

export function SearchFilters({
  filters,
  setFilters,
  onApplyFilters,
  facets,
  loading = false,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    year: true,
    repository: true,
    type: true,
    author: true,
  })

  const { health } = useSystemHealth()

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Extract unique values from facets
  const years = facets?.years || []
  const repositories = facets?.repositories || []
  const types = facets?.types || []

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
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">All Years</option>
            {years.slice(0, 20).map((year) => (
              <option key={year.name} value={year.name}>
                {year.name} ({year.count})
              </option>
            ))}
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
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">All Repositories</option>
            {repositories.map((repo) => (
              <option key={repo.name} value={repo.name}>
                {repo.name} ({repo.count})
              </option>
            ))}
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
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name} ({type.count})
              </option>
            ))}
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
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        )}
      </div>

      {/* Apply Filters Button */}
      <Button
        onClick={onApplyFilters}
        disabled={loading}
        className="w-full bg-blue-900 hover:bg-blue-800 text-white disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Apply Filters'}
      </Button>

      {/* System Info */}
      {health && (
        <div className="bg-gray-100 rounded p-4 text-sm space-y-1">
          <h3 className="font-semibold text-gray-900 mb-2">System Info</h3>
          <div className="text-gray-700">
            <div>
              <span className="font-medium">Records:</span>{' '}
              {health.data.total_records.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Theses:</span>{' '}
              {health.data.theses.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Articles:</span>{' '}
              {health.data.articles.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Research Data:</span>{' '}
              {health.data.research.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Last Harvest:</span>{' '}
              {health.harvest.last_harvest !== 'Never'
                ? new Date(health.harvest.last_harvest).toLocaleString()
                : 'Never'}
            </div>
            <div className="mt-2">
              <span className="font-medium">Includes E-LIS:</span>
              <span className="ml-1 text-green-600">✓</span>
            </div>
            <div>
              <span className="font-medium">Includes OpenAlex:</span>
              <span className="ml-1 text-green-600">✓</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
