'use client'

import {
  ExternalLink,
  Loader2,
  FileText,
  Calendar,
  User,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Record as RecordType } from '@/lib/types'

interface ArticleGridProps {
  records: RecordType[]
  loading?: boolean
  selectedRecords: Set<string>
  onToggleRecord: (recordId: string) => void
  onSelectAll: () => void
  onClearSelection: () => void
  onExportSelected: () => void
}

export function ArticleGrid({
  records,
  loading = false,
  selectedRecords,
  onToggleRecord,
  onSelectAll,
  onClearSelection,
  onExportSelected,
}: ArticleGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
        <span className="ml-3 text-gray-600">Loading records...</span>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">No records found</p>
        <p className="text-gray-500 text-sm mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    )
  }

  const allSelected =
    records.length > 0 && records.every((r) => selectedRecords.has(r.id))

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={allSelected}
            onCheckedChange={() =>
              allSelected ? onClearSelection() : onSelectAll()
            }
            className="w-5 h-5"
          />
          <span className="text-sm text-gray-700">
            {selectedRecords.size > 0
              ? `${selectedRecords.size} selected`
              : 'Select all'}
          </span>
        </div>
        {selectedRecords.size > 0 && (
          <div className="flex gap-2">
            <Button
              onClick={onClearSelection}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Clear Selection
            </Button>
            <Button
              onClick={onExportSelected}
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm"
              size="sm"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export RIS ({selectedRecords.size})
            </Button>
          </div>
        )}
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {records.map((record) => (
          <div
            key={record.id}
            className={`bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
              selectedRecords.has(record.id)
                ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-5 py-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2">
                    {record.type}
                  </span>
                  <h3 className="text-base font-bold leading-tight line-clamp-2">
                    {record.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-white/90">
                    {record.authors?.[0] || 'Unknown Author'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Description */}
              {record.description && (
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {record.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Publication Year</span>
                  </div>
                  {record.year && (
                    <span className="text-sm font-semibold text-gray-900">
                      {record.year}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {record.source}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              {/* {record.keywords && record.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {record.keywords.slice(0, 4).map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 text-xs font-medium rounded-full border border-blue-100"
                    >
                      {keyword}
                    </span>
                  ))}
                  {record.keywords.length > 4 && (
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{record.keywords.length - 4} more
                    </span>
                  )}
                </div>
              )} */}

              {/* Additional Authors
              {record.authors && record.authors.length > 1 && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Authors: </span>
                  {record.authors.slice(1, 3).join(', ')}
                  {record.authors.length > 4 &&
                    `, +${record.authors.length - 4} more`}
                </div>
              )} */}

              {/* Identifier */}
              {/* {record.identifier && (
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="flex-1">
                      <span className="font-semibold text-gray-600 mr-2">
                        {record.identifierType}:
                      </span>
                      <span className="font-mono text-gray-700 break-all">
                        {record.identifier}
                      </span>
                    </div>
                  </div>
                </div>
              )} */}
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedRecords.has(record.id)}
                    onCheckedChange={() => onToggleRecord(record.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-600">
                    {selectedRecords.has(record.id) ? 'Selected' : 'Select'}
                  </span>
                </div>
                {record.url && record.url !== '' && record.url !== '#' ? (
                  <Button
                    onClick={() =>
                      window.open(record.url, '_blank', 'noopener,noreferrer')
                    }
                    className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white text-sm px-5 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Full Article
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="bg-gray-200 text-gray-400 text-sm px-5 font-medium cursor-not-allowed"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    No Link Available
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
