'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { CourseCategory, CourseCategoryInput } from './categories/types'
import { CreateCategoryModal } from './categories/CreateCategoryModal'
import { EditCategoryModal } from './categories/EditCategoryModal'

export default function CourseCategoryTable() {
  const [categories, setCategories] = useState<CourseCategory[]>([])
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to load categories')
      setCategories(await res.json())
    } catch (error: any) {
      console.error('Failed to load categories', error)
      toast.error(error.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = async (data: CourseCategoryInput) => {
    const payload = {
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || undefined,
    }

    const res = await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Creation failed')
      return
    }

    const newCat = await res.json()
    setCategories((prev) => [...prev, newCat])
    toast.success('Created successfully')
    setShowCreateModal(false)
  }

  const handleEdit = async (data: CourseCategoryInput): Promise<void> => {
    if (!selectedCategory) {
      toast.error('Invalid category')
      return
    }

    const payload = {
      name: data.name.trim(),
      code: data.code.trim(),
      description: data.description?.trim() || undefined,
    }

    const res = await fetch(`/api/categories/${selectedCategory._id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Update failed')
      return
    }

    const updated = await res.json()

    // Update state
    setCategories((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    )

    toast.success('Updated')
    setSelectedCategory(null)
    setShowEditModal(false)

    // ✅ Do NOT return anything
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return

    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || 'Delete failed')
      return
    }

    setCategories((prev) => prev.filter((c) => c._id !== id))
    toast.success('Deleted')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Categories</h1>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          onClick={() => setShowCreateModal(true)}
        >
          + Create
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Code</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="p-3">{cat._id}</td>
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.code}</td>
                <td className="p-3 flex space-x-3">
                  <button
                    className="text-indigo-600"
                    onClick={() => {
                      setSelectedCategory(cat)
                      setShowEditModal(true)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        category={selectedCategory}
        onClose={() => {
          setSelectedCategory(null)
          setShowEditModal(false)
        }}
        onEdit={handleEdit}
      />
    </div>
  )
}
