'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
// Ensure your types are correctly defined here
import { Course, CourseInput } from './courses/types'
import { CreateCourseModal } from './courses/CreateCourseModal'
import { EditCourseModal } from './courses/EditCourseModal'

export default function CourseComponent() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch courses with defensive parsing
  const fetchCourses = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/courses')

      if (!res.ok) {
        // Attempt to read the error message from the response body
        const errorText = await res.text()
        try {
          const errJson = JSON.parse(errorText)
          throw new Error(errJson.message || `Server error: ${res.status}`)
        } catch {
          throw new Error(`Failed to load courses: ${res.statusText}`)
        }
      }

      const rawData = await res.json()
      let coursesArray: Course[] = []

      // --- Defensive Parsing Logic ---
      if (Array.isArray(rawData)) {
        coursesArray = rawData
      } else if (rawData.data && Array.isArray(rawData.data)) {
        // Handles API wrapping like { data: [...] }
        coursesArray = rawData.data
      } else if (rawData.courses && Array.isArray(rawData.courses)) {
        // Handles API wrapping like { courses: [...] }
        coursesArray = rawData.courses
      } else {
        // Fallback if the structure is completely unexpected
        console.warn('API returned unexpected format for courses:', rawData)
        coursesArray = []
      }
      // --- End Defensive Parsing Logic ---

      setCourses(coursesArray)
    } catch (error: unknown) {
      console.error('Error fetching courses:', error)
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  // --- CRUD Handlers ---

  // Create course
  const handleCreate = async (data: CourseInput): Promise<void> => {
    const payload = {
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || undefined,
      duration: data.duration?.trim(),
      isOpen: data.isOpen ?? true,
      categoryId: data.categoryId,
    }

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Creation failed')
      }
      const newCourse = await res.json()
      setCourses((prev) => [...prev, newCourse])
      toast.success('Course created successfully')
      setShowCreateModal(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Edit course
  const handleEdit = async (data: CourseInput): Promise<void> => {
    if (!selectedCourse) {
      toast.error('Invalid course')
      return
    }

    const payload = {
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || undefined,
      duration: data.duration?.trim() || undefined,
      isOpen: data.isOpen ?? true,
      categoryId: data.categoryId,
    }

    try {
      const res = await fetch(`/api/courses/${selectedCourse._id}`, {
        method: 'PATCH', // Assumed from original code
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Update failed')
      }
      const updated = await res.json()
      setCourses((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      )
      toast.success('Course updated successfully')

      // Removed redundant fetchCourses() call here, mapping the state is faster
      setSelectedCourse(null)
      setShowEditModal(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Delete course
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Delete failed')
      }
      setCourses((prev) => prev.filter((c) => c._id !== id))
      toast.success('Course deleted')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // --- Render Component ---

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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
              <th className="p-3 text-left font-semibold text-sm">ID</th>
              <th className="p-3 text-left font-semibold text-sm">Name</th>
              <th className="p-3 text-left font-semibold text-sm">Code</th>
              <th className="p-3 text-left font-semibold text-sm">Category</th>
              <th className="p-3 text-left font-semibold text-sm">Reg Open</th>
              <th className="p-3 text-left font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course._id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-3">{course._id}</td>
                <td className="p-3">{course.name}</td>
                <td className="p-3">{course.code}</td>
                <td className="p-3">
                  {/* FIX: Correctly access the category name */}
                  {course.categoryId
                    ? typeof course.categoryId === 'object'
                      ? course.categoryId.name // Assumes the object has a 'name' field
                      : 'Unpopulated' // If it's a string ID but not populated
                    : 'N/A'}
                </td>
                <td className="p-3">{course.isOpen ? 'Yes' : 'No'}</td>
                <td className="p-3 flex space-x-3">
                  <button
                    className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    onClick={() => {
                      setSelectedCourse(course)
                      setShowEditModal(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition-colors"
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

      {/* Modals remain the same */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      <EditCourseModal
        isOpen={showEditModal}
        course={selectedCourse}
        onClose={() => {
          setSelectedCourse(null)
          setShowEditModal(false)
        }}
        onEdit={handleEdit}
      />
    </div>
  )
}
