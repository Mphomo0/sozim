'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function ApplicationStatusCard() {
  const [page, setPage] = useState(1)
  const limit = 10

  const { user, isLoaded } = useUser()

  const applicationsRaw = useQuery(
    api.applications.getApplicationsByUserId,
    user ? { clerkId: user.id } : 'skip'
  )
  const coursesRaw = useQuery(api.courses.getCourses)

  const loading = applicationsRaw === undefined
  const errorState = null

  const applications = applicationsRaw || []
  const totalPages = Math.ceil(applications.length / limit) || 1
  const currentPage = page > totalPages ? totalPages : page
  const startIndex = (currentPage - 1) * limit
  const currentApplications = applications.slice(startIndex, startIndex + limit)

  const getCourseName = (courseId: string) => {
    const course = (coursesRaw || []).find(
      (c) => c._id === courseId || c.mongoId === courseId
    )
    return course ? (course.code ? `${course.name}` : course.name) : courseId
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
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  if (!isLoaded) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-500">Loading session...</p>
        </div>
      </div>
    )
  }

  if (isLoaded && !user) {
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

  if (errorState) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="text-center py-8">
          <p className="text-red-500 font-medium">{errorState}</p>
          <button
            onClick={() => setPage(1)}
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
          {applications.length}{' '}
          {applications.length === 1 ? 'application' : 'applications'} total
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
          {/* Desktop Table Header */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Course</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</div>
          </div>

          {/* Applications List */}
          <div className="divide-y divide-gray-200">
            {currentApplications.map((app) => (
              <div
                key={app._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Application ID</p>
                      <p className="text-sm font-medium text-gray-900">#{app._id.slice(-8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(app.status || 'PENDING')}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Course</p>
                    <p className="text-sm text-gray-900">{getCourseName(app.courseId)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted On</p>
                    <p className="text-sm text-gray-500">
                      {app._creationTime ? new Date(app._creationTime).toLocaleDateString('en-ZA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }) : ''}
                    </p>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid md:grid-cols-4 gap-4 items-center">
                  <div className="text-sm font-medium text-gray-900">
                    #{app._id.slice(-8).toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-900 truncate">
                    {getCourseName(app.courseId)}
                  </div>
                  <div>
                    {getStatusBadge(app.status || 'PENDING')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {app._creationTime ? new Date(app._creationTime).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    }) : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-4 border-t bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                Showing page{' '}
                <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
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
