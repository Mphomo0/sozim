'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
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
import { Pencil, Trash2, Plus, Search, BookOpen, GraduationCap, Download } from 'lucide-react'
import { Pagination } from '@/components/global/Pagination'

export default function CourseComponent() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  const coursesResponse = useQuery(api.courses.getCourses)
  const deleteCourse = useMutation(api.courses.deleteCourse)

  const loading = coursesResponse === undefined
  const allCourses = coursesResponse || []

  // Handle client-side search and pagination inline
  const result = search
    ? allCourses.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : allCourses

  const totalPages = Math.ceil(result.length / limit) || 1
  const currentPage = page > totalPages ? totalPages : page
  const startIndex = (currentPage - 1) * limit
  
  const courses = result.slice(startIndex, startIndex + limit)

  const handleDelete = async (id: Id<'courses'>) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      await deleteCourse({ id })
      toast.success('Course deleted')
    } catch (err) {
      toast.error('Failed to delete course')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <Input
            placeholder="Search courses by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 bg-white border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a href="/api/export/courses" download>
            <Button variant="outline" className="h-11 px-4 rounded-xl border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="h-5 w-5 mr-2 sm:mr-0 md:mr-2" />
              <span className="inline sm:hidden md:inline">Export</span>
            </Button>
          </a>
          <Link href="/dashboard/admin/courses/new" passHref>
            <Button
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 group"
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Course
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No courses found</p>
            <p className="mt-1">Try adjusting your search terms.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 h-14 pl-6">Course</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Code</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Level</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 h-14 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 line-clamp-1">{course.name}</span>
                          <span className="text-xs text-gray-500 mt-1">{course.qualification}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 font-mono font-medium">
                          {course.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        {course.level ? (
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <GraduationCap className="h-3 w-3" />
                            Level {course.level}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/admin/courses/edit/${course._id}`} passHref>
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
                            onClick={() => handleDelete(course._id)}
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
              {courses.map((course) => (
                <div key={course._id} className="p-4 flex flex-col space-y-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-base">{course.name}</span>
                      <span className="text-xs text-gray-500 mt-1">{course.qualification}</span>
                    </div>
                    <code className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 font-mono font-medium whitespace-nowrap">
                      {course.code}
                    </code>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <GraduationCap className="h-4 w-4 mr-2 text-indigo-400" />
                    <span>{course.level ? `Level ${course.level}` : 'Level N/A'}</span>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <Link href={`/dashboard/admin/courses/edit/${course._id}`} passHref className="flex-1">
                      <Button variant="outline" className="w-full h-10 text-indigo-600 hover:text-indigo-800 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all active:scale-[0.98]">
                        <Pencil size={16} className="mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 text-rose-600 hover:text-rose-800 border-rose-100 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                      onClick={() => handleDelete(course._id)}
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              limit={limit}
            />
          </div>
        )}
      </div>
    </div>
  )
}
