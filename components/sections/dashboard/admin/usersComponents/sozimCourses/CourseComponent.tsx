'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { Course, CourseInput } from './courses/types'
import { CreateCourseModal } from './courses/CreateCourseModal'
import { EditCourseModal } from './courses/EditCourseModal'

export default function CourseComponent() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/courses')
      if (!res.ok) throw new Error('Failed to load courses')

      const data = await res.json()

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.courses)
        ? data.courses
        : Array.isArray(data?.data)
        ? data.data
        : []

      setCourses(list)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // ---------------------------
  // CREATE COURSE
  // ---------------------------

  const handleCreate = async (data: CourseInput) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // send everything
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create')
      }

      const created = await res.json()
      setCourses((prev) => [...prev, created])

      toast.success('Course created!')
      setShowCreateModal(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to create course')
    }
  }

  // ---------------------------
  // EDIT COURSE
  // ---------------------------

  const handleEdit = async (data: CourseInput) => {
    if (!selectedCourse) return

    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // send full updated object
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update')
      }

      const updated = await res.json()

      // Update state
      setCourses((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      )

      toast.success('Course updated!')
      setSelectedCourse(null)
      setShowEditModal(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to update course')
    }
  }

  // ---------------------------
  // DELETE COURSE
  // ---------------------------

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return

    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to delete')
      }

      setCourses((prev) => prev.filter((c) => c._id !== id))
      toast.success('Course deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete course')
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          onClick={() => setShowCreateModal(true)}
        >
          + Create
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="min-w-full border shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left font-semibold text-sm">Name</th>
              <th className="p-3 text-left font-semibold text-sm">Code</th>
              <th className="p-3 text-left font-semibold text-sm">Category</th>
              <th className="p-3 text-left font-semibold text-sm">Open?</th>
              <th className="p-3 text-left font-semibold text-sm">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{course.name}</td>
                <td className="p-3">{course.code}</td>
                <td className="p-3">
                  {typeof course.categoryId === 'object'
                    ? course.categoryId?.name
                    : 'Unpopulated'}
                </td>
                <td className="p-3">{course.isOpen ? 'Yes' : 'No'}</td>

                <td className="p-3 flex space-x-3">
                  <button
                    className="text-indigo-600 hover:underline"
                    onClick={() => {
                      setSelectedCourse(course)
                      setShowEditModal(true)
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CREATE MODAL */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      {/* EDIT MODAL */}
      <EditCourseModal
        isOpen={showEditModal}
        onClose={() => {
          setSelectedCourse(null)
          setShowEditModal(false)
        }}
        course={selectedCourse}
        onEdit={handleEdit}
      />
    </div>
  )
}
