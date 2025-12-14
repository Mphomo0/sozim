'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Course {
  _id: string
  name: string
  code?: string
}

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
}

interface Application {
  _id: string
  status: string
  createdAt: string
  applicantId: User | string
  courseId: Course | string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function ApplicationStatusCard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: session, status } = useSession()

  const fetchApplications = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/applications/loggedinUser?page=${page}&limit=10`
      )
      if (!res.ok) throw new Error('Failed to fetch applications')
      const data = await res.json()
      setApplications(data.data || [])
      setPagination(data.pagination)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchApplications(1)
    }
  }, [session])

  const getCourseName = (courseId: Course | string) => {
    if (typeof courseId === 'object' && courseId !== null) {
      return courseId.code ? `${courseId.name}` : courseId.name
    }
    return courseId as string
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Pending',
      },
      APPROVED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Approved',
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Rejected',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status,
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    )
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchApplications(newPage)
    }
  }

  if (status === 'loading') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center py-8">
          <p className="text-red-500 font-medium">
            Unauthorized. Please log in.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center py-8">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => fetchApplications(1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
        <p className="text-sm text-gray-500 mt-1">
          {pagination.total}{' '}
          {pagination.total === 1 ? 'application' : 'applications'} total
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No applications yet</p>
          <p className="text-gray-400 text-sm mt-1">
            You haven't submitted any applications yet.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr
                    key={app._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{app._id.slice(-8).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {getCourseName(app.courseId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString('en-ZA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page{' '}
                <span className="font-medium">{pagination.page}</span> of{' '}
                <span className="font-medium">{pagination.totalPages}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
