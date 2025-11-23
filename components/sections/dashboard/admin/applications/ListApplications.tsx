'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Edit, Trash2, FileText, Plus } from 'lucide-react'
import { Pagination } from '@/components/global/Pagination'

interface DocumentsFile {
  fileId: string
  url: string
}

interface Application {
  _id: string
  applicantId:
    | {
        firstName: string
        lastName: string
        email: string
      }
    | string
  courseId:
    | {
        name: string
      }
    | string
  status: string
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
        if (!delRes.ok) throw new Error('Failed to delete files from ImageKit')
      }

      toast.success('Application and files deleted successfully')
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
    if (typeof app.applicantId === 'object') {
      return `${app.applicantId.firstName} ${app.applicantId.lastName}`
    }
    return app.applicantId
  }

  const getCourseName = (app: Application) => {
    if (typeof app.courseId === 'object') return app.courseId.name
    return app.courseId
  }

  // --- Render ---
  if (isLoading) return <div className="p-8">Loading applications...</div>

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <Link
          href="/dashboard/admin/applications/new"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> New Application
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-medium">Applicant</th>
              <th className="p-4 font-medium">Course</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Docs</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{getApplicantName(app)}</td>
                  <td className="p-4">{getCourseName(app)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FileText size={14} />
                      {app.documents?.length || 0}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/dashboard/admin/applications/edit/${app._id}`}
                      className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="py-8">
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
      </div>
    </div>
  )
}
