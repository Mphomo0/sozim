'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Search, Pencil, Trash2, Plus, ChevronLeft, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function CourseCategoryTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const categoriesResponse = useQuery(api.categories.getCategories)
  const deleteCategory = useMutation(api.categories.deleteCategory)

  const loading = categoriesResponse === undefined
  const categories = categoriesResponse || []

  const handleDelete = async (id: Id<'courseCategories'>) => {
    if (!confirm('Delete this category?')) return

    try {
      await deleteCategory({ id })
      toast.success('Deleted successfully')
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search categories by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full">
          <a href="/api/export/categories" download className="w-full">
            <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm w-full">
              <Download className="h-5 w-5 mr-2 sm:mr-0 md:mr-2" />
              <span className="inline sm:hidden md:inline">Export</span>
            </Button>
          </a>
          <Link href="/dashboard/admin/courses/category/new" passHref>
            <Button
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 group"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-sm lg:text-base">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            Loading categories...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No categories found</p>
            <p className="mt-1">Try adjusting your search terms.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 h-14 pl-6 w-[35%]">Name</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Code</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-gray-900 h-14">ID</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 h-14 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((cat) => (
                    <TableRow key={cat._id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="font-medium text-gray-900 pl-6">{cat.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 font-mono font-medium">
                          {cat.code}
                        </code>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-gray-400 font-mono">
                        {cat._id}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/admin/courses/category/edit/${cat._id}`} passHref>
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
                            onClick={() => handleDelete(cat._id)}
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
              {filteredCategories.map((cat) => (
                <div key={cat._id} className="p-4 flex flex-col space-y-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900 text-base">{cat.name}</span>
                    <code className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 font-mono font-medium shrink-0 ml-2">
                      {cat.code}
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <Link href={`/dashboard/admin/courses/category/edit/${cat._id}`} passHref className="flex-1">
                      <Button variant="outline" className="w-full h-10 text-indigo-600 hover:text-indigo-800 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all active:scale-[0.98]">
                        <Pencil size={16} className="mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 text-rose-600 hover:text-rose-800 border-rose-100 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                      onClick={() => handleDelete(cat._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
