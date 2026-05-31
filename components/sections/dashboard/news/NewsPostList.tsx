'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Plus, Search, FileText, Eye, EyeOff } from 'lucide-react'
import { Pagination } from '@/components/global/Pagination'
import { format } from 'date-fns'

export default function NewsPostList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const postsResponse = useQuery(api.newsPosts.getAllNewsPostsForAdmin)
  const deleteNewsPost = useMutation(api.newsPosts.deleteNewsPost)

  const loading = postsResponse === undefined
  const allPosts = postsResponse || []

  const result = search
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase())
      )
    : allPosts

  const totalPages = Math.ceil(result.length / limit) || 1
  const currentPage = page > totalPages ? totalPages : page
  const startIndex = (currentPage - 1) * limit
  const posts = result.slice(startIndex, startIndex + limit)

  const handleDelete = async (id: Id<'newsPosts'>) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      await deleteNewsPost({ id })
      toast.success('Article deleted')
    } catch (err) {
      toast.error('Failed to delete article')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search articles by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-xl"
          />
        </div>
        <Link href="/dashboard/news/new" passHref>
          <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 group">
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            Loading articles...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No articles found</p>
            <p className="mt-1">
              {search ? 'Try adjusting your search terms.' : 'Create your first news article.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 h-14 pl-6">Title</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Status</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Published</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 h-14 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post._id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 line-clamp-1">{post.title}</span>
                          <span className="text-xs text-gray-400 font-mono mt-0.5">/{post.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.status === 'published' ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                            <Eye className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {post.publishedAt ? format(post.publishedAt, 'MMM d, yyyy') : '—'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/news/${post._id}/edit`} passHref>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
                            onClick={() => handleDelete(post._id as Id<'newsPosts'>)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {posts.map((post) => (
                <div key={post._id} className="p-4 flex flex-col space-y-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-gray-900 text-base line-clamp-2">{post.title}</span>
                    {post.status === 'published' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shrink-0">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 shrink-0">
                        Draft
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 font-mono">/{post.slug}</div>
                  {post.publishedAt && (
                    <div className="text-xs text-gray-500">{format(post.publishedAt, 'MMM d, yyyy')}</div>
                  )}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <Link href={`/dashboard/news/${post._id}/edit`} passHref className="flex-1">
                      <Button variant="outline" className="w-full h-10 text-indigo-600 hover:text-indigo-800 border-indigo-100 rounded-xl">
                        <Pencil size={16} className="mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 text-rose-600 hover:text-rose-800 border-rose-100 rounded-xl"
                      onClick={() => handleDelete(post._id as Id<'newsPosts'>)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/30 mt-auto">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} limit={limit} />
          </div>
        )}
      </div>
    </div>
  )
}
