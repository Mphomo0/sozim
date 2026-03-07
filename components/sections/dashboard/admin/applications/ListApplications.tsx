'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Edit, Trash2, FileText, Plus, Calendar, Search } from 'lucide-react'
import { Pagination } from '@/components/global/Pagination'
import { format } from 'date-fns'
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
import { Badge } from '@/components/ui/badge'

interface DocumentsFile {
  fileId: string
  url: string
}

interface Applicant {
  firstName: string
  lastName: string
  email: string
}

interface Course {
  name: string
}

interface Application {
  _id: string
  applicantId: Applicant | string
  courseId: Course | string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  documents: DocumentsFile[]
  createdAt: string
}

interface ApplicationsResponse {
  data: Application[]
  pagination: {
    totalPages: number
    page: number
    limit: number
    total: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export default function ListApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // --- Fetch Data ---
  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/applications?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`
      )
      if (!res.ok) throw new Error('Failed to fetch applications')

      const data: ApplicationsResponse = await res.json()
      setApplications(data.data)
      setTotalPages(data.pagination.totalPages)
    } catch (error: unknown) {
      console.error(error)
      const message =
        error instanceof Error ? error.message : 'Failed to load applications'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, limit, debouncedSearch])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  // --- Delete Functionality ---
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete application')

      const data: Application = await res.json()
      const fileIds = data.documents?.map((doc) => doc.fileId) || []

      if (fileIds.length > 0) {
        const delRes = await fetch('/api/images/delete-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileIds }),
        })
        if (!delRes.ok) {
          const err = await delRes.json()
          console.warn('Failed to delete some files from ImageKit:', err)
          // Continue anyway — application is deleted
        }
      }

      toast.success('Application deleted successfully')
      fetchApplications()
    } catch (error: unknown) {
      console.error(error)
      const message =
        error instanceof Error ? error.message : 'Error deleting application'
      toast.error(message)
    }
  }

  // --- Helpers ---
  const getApplicantName = (app: Application) => {
    if (typeof app.applicantId === 'object' && app.applicantId) {
      return `${app.applicantId.firstName} ${app.applicantId.lastName}`
    }
    return 'Unknown Applicant'
  }

  const getCourseName = (app: Application) => {
    if (typeof app.courseId === 'object' && app.courseId) {
      return app.courseId.name
    }
    return 'Unknown Course'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-rose-50 text-rose-700 border-rose-200">Rejected</Badge>
      case 'PENDING':
      default:
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
    }
  }

  // --- Render ---
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-600">Loading applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
            className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-sm rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <Link
          href="/dashboard/admin/applications/new"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-sm active:scale-95 font-medium"
        >
          <Plus size={18} />
          New Application
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No applications found</p>
            <p className="text-gray-500 mt-1">No results match your current search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 h-14 pl-8">Applicant</TableHead>
                  <TableHead className="font-bold text-gray-900 h-14">Course</TableHead>
                  <TableHead className="font-bold text-gray-900 h-14">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 h-14">Docs</TableHead>
                  <TableHead className="font-bold text-gray-900 h-14">Submitted</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 h-14 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app._id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="pl-8 py-4 font-medium text-gray-900">
                      {getApplicantName(app)}
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {getCourseName(app)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded inline-flex">
                        <FileText size={14} className="text-gray-400" />
                        {app.documents?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {format(new Date(app.createdAt), 'dd MMM yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 transition-opacity translate-x-2 duration-300">
                        <Link href={`/dashboard/admin/applications/edit/${app._id}`} passHref>
                           <Button
                            variant="ghost"
                            size="icon"
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                          >
                            <Edit size={18} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(app._id)}
                          className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg"
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/30 mt-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              limit={limit}
              onLimitChange={(newLimit) => {
                setLimit(newLimit)
                setCurrentPage(1)
              }}
              showLimitSelector={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
