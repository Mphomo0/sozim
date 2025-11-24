'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Application {
  _id: string
  status: string
  createdAt: string
  applicantId: string
  courseId:
    | {
        name: string
      }
    | string
}

export default function ApplicationStatusCard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { data: session, status } = useSession()
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return

    const fetchApplications = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/applications/loggedinUser')
        if (!res.ok) throw new Error('Failed to fetch applications')
        const data = await res.json()
        setApplications(data.data || [])
      } catch (err) {
        console.error(err)
        setError('Failed to fetch applications')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [userId])

  if (status === 'loading') return <p>Loading session...</p>
  if (!session) return <p>Unauthorized. Please log in.</p>
  if (loading) return <p>Loading applications...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">My Applications</h2>
      {applications.length === 0 ? (
        <p className="text-gray-500">
          You have not submitted any applications yet.
        </p>
      ) : (
        <div className="">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Course
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Submitted On
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="px-4 py-2">{app._id}</td>
                  <td className="px-4 py-2">
                    {(app.courseId as { name: string }).name}
                  </td>
                  <td className="px-4 py-2">{app.status}</td>
                  <td className="px-4 py-2">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
