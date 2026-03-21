'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import {
  Edit,
  Trash2,
  FileText,
  Plus,
  Calendar,
  Search,
  Download,
} from 'lucide-react'
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
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface DocumentsFile {
  fileId: string
  url: string
}

export default function ListApplications() {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const applicationsRaw = useQuery(api.applications.getApplications, {})
  const deleteAppMut = useMutation(api.applications.deleteApplication)

  const isLoading = applicationsRaw === undefined
  const allApplications = applicationsRaw || []

  // Ensure data aligns with legacy typing for rendering
  const result = searchTerm
    ? allApplications.filter((app: any) => {
        const userName = app.user
          ? `${app.user.firstName} ${app.user.lastName} ${app.user.clerkId}`
          : ''
        const courseName = app.course ? app.course.name : ''
        const searchTarget =
          `${app.status} ${app.courseId} ${courseName} ${userName}`.toLowerCase()
        return searchTarget.includes(searchTerm.toLowerCase())
      })
    : allApplications

  const totalPages = Math.ceil(result.length / limit) || 1
  const validPage = currentPage > totalPages ? totalPages : currentPage
  const startIndex = (validPage - 1) * limit
  const applications = result.slice(startIndex, startIndex + limit)

  // --- Delete Functionality ---
  const handleDelete = async (id: Id<'applications'>) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      await deleteAppMut({ id })
      // Keep ImageKit cleanup logic loosely (but missing file IDs without finding the matching app)
      const targetApp = allApplications.find((a: any) => a._id === id)
      const fileIds =
        (targetApp?.documents as any[])?.map((doc: any) => doc.fileId) || []

      if (fileIds.length > 0) {
        const delRes = await fetch('/api/images/delete-files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileIds }),
        })
        if (!delRes.ok) {
          console.warn('Failed to delete some files from ImageKit')
        }
      }

      toast.success('Application deleted successfully')
    } catch (error: unknown) {
      console.error(error)
      toast.error('Error deleting application')
    }
  }

  // --- Helpers ---
  const renderApplicantInfo = (app: any) => {
    if (app.user) {
      return (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 tracking-tight">
            {app.user.firstName} {app.user.lastName}
          </span>
          <span className="text-[10px] text-indigo-500 font-mono mt-1 uppercase bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
            CLERK: {app.user.clerkId || 'N/A'}
          </span>
        </div>
      )
    }

    // Fallback for cases where join failed or legacy string ID
    const displayId =
      typeof app.applicantId === 'string' ? app.applicantId : 'Unknown'
    return (
      <div className="flex flex-col">
        <span className="font-medium text-gray-500">Unknown Applicant</span>
        <span className="text-[10px] text-gray-400 font-mono mt-1 uppercase">
          ID: {displayId.slice(-8)}
        </span>
      </div>
    )
  }

  const getCourseName = (app: any) => {
    if (app.course && app.course.name) {
      return app.course.name
    }
    if (typeof app.courseId === 'object' && app.courseId) {
      return app.courseId.name
    }
    return app.courseId || 'Unknown Course'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Approved
          </Badge>
        )
      case 'REJECTED':
        return (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200">
            Rejected
          </Badge>
        )
      case 'PENDING':
      default:
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        )
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
        <div className="flex items-center gap-2 w-full">
          <a href="/api/export/applications" download className="w-full">
            <Button
              variant="outline"
              className="h-11 px-4 rounded-xl border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm w-full"
            >
              <Download className="h-4 w-4 mr-2 hidden sm:inline" />
              Export
            </Button>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {applications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">
              No applications found
            </p>
            <p className="text-gray-500 mt-1">
              No results match your current search.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 h-14 pl-8">
                      Applicant
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">
                      Course
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">
                      Docs
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">
                      Submitted
                    </TableHead>
                    <TableHead className="text-right font-bold text-gray-900 h-14 pr-8">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow
                      key={app._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <TableCell className="pl-8 py-4 font-medium text-gray-900">
                        {renderApplicantInfo(app)}
                      </TableCell>
                      <TableCell className="text-gray-700 font-medium">
                        {getCourseName(app)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(app.status || 'PENDING')}
                      </TableCell>
                      <TableCell>
                        <div className="inline-flexflex items-center gap-1.5 text-gray-500 text-sm font-medium bg-gray-50 px-2 py-1 rounded inline-flex">
                          <FileText size={14} className="text-gray-400" />
                          {((app.documents as any[]) || []).length}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-gray-400" />
                          {app._creationTime
                            ? format(new Date(app._creationTime), 'dd MMM yyyy')
                            : ''}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 transition-opacity translate-x-2 duration-300">
                          <Link
                            href={`/dashboard/admin/applications/edit/${app._id}`}
                            passHref
                          >
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

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="mb-1">{renderApplicantInfo(app)}</div>
                      <p className="text-sm font-medium text-gray-600 mt-1">
                        {getCourseName(app)}
                      </p>
                    </div>
                    <div>{getStatusBadge(app.status || 'PENDING')}</div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <span className="font-medium">
                        {((app.documents as any[]) || []).length} Docs
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span>
                        {app._creationTime
                          ? format(new Date(app._creationTime), 'MMM dd, yyyy')
                          : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <Link
                      href={`/dashboard/admin/applications/edit/${app._id}`}
                      passHref
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full h-10 text-indigo-600 hover:text-indigo-800 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all active:scale-[0.98]"
                      >
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 text-rose-600 hover:text-rose-800 border-rose-100 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                      onClick={() => handleDelete(app._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
