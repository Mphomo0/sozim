'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Edit, Trash2, FileText, Plus, Calendar } from 'lucide-react'
import { Pagination } from '@/components/global/Pagination'
import { format } from 'date-fns'

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

  // --- Fetch Data ---
  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/applications?page=${currentPage}&limit=${limit}`
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
  }, [currentPage, limit])

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
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800'
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <Link
          href="/dashboard/admin/applications/new"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Application
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Applicant</th>
                <th className="p-4 font-semibold text-gray-700">Course</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Documents</th>
                <th className="p-4 font-semibold text-gray-700">Submitted</th>
                <th className="p-4 font-semibold text-gray-700 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-900">
                      {getApplicantName(app)}
                    </td>
                    <td className="p-4 text-gray-700">{getCourseName(app)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText size={16} />
                        <span className="font-medium">
                          {app.documents?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {format(new Date(app.createdAt), 'dd MMM yyyy')}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/applications/edit/${app._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t px-6 py-4 bg-gray-50">
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
