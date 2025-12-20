'use client'

import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface Article {
  id: number
  source: string
  repository: string
  title: string
  authors: string[]
  year: number
  doi: string
  description?: string
}

interface ArticleGridProps {
  articles: Article[]
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="bg-blue-900 text-white px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-medium">{article.source}</span>
            <span className="text-xs">{article.repository}</span>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2">
              {article.title}
            </h3>

            {/* Authors */}
            <div className="text-sm text-red-600 font-medium">
              {article.authors.join(', ')}
            </div>

            {/* Description */}
            {article.description && (
              <p className="text-sm text-gray-600 line-clamp-3">
                {article.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between items-start text-sm">
                <div>
                  <span className="text-gray-600">Year: </span>
                  <span className="font-medium text-gray-900">
                    {article.year}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 break-all">
                <span className="font-medium">ID: </span>
                {article.doi}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white text-sm px-4">
                <ExternalLink className="w-3 h-3 mr-2" />
                Open
              </Button>
              <Checkbox className="w-5 h-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
