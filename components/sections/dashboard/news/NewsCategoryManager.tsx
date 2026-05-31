'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { Search, Pencil, Trash2, Plus } from 'lucide-react'
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

export function NewsCategoryManager() {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<{ id: Id<'newsCategories'>; name: string; description?: string } | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const categories = useQuery(api.newsCategories.getNewsCategories)
  const createCategory = useMutation(api.newsCategories.createNewsCategory)
  const updateCategory = useMutation(api.newsCategories.updateNewsCategory)
  const deleteCategory = useMutation(api.newsCategories.deleteNewsCategory)

  const loading = categories === undefined
  const allCategories = categories || []

  const filtered = allCategories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      await createCategory({ name: newName.trim(), description: newDescription.trim() || undefined })
      toast.success('Category created')
      setNewName('')
      setNewDescription('')
    } catch (err) {
      toast.error('Failed to create category')
    }
  }

  const handleUpdate = async () => {
    if (!editing || !editName.trim()) return
    try {
      await updateCategory({ id: editing.id, name: editName.trim(), description: editDescription.trim() || undefined })
      toast.success('Category updated')
      setEditing(null)
    } catch (err) {
      toast.error('Failed to update category')
    }
  }

  const handleDelete = async (id: Id<'newsCategories'>) => {
    if (!confirm('Delete this category?')) return
    try {
      await deleteCategory({ id })
      toast.success('Category deleted')
    } catch (err) {
      toast.error('Failed to delete category')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/50 border border-gray-100 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Category</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="h-11 bg-white border-gray-200 rounded-xl"
          />
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="h-11 bg-white border-gray-200 rounded-xl flex-1"
          />
          <Button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            Loading categories...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No categories found</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-gray-900 h-14 pl-6">Name</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Slug</TableHead>
                    <TableHead className="font-bold text-gray-900 h-14">Description</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 h-14 pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((cat) => (
                    <TableRow key={cat._id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900 pl-6">{cat.name}</TableCell>
                      <TableCell className="text-xs text-gray-400 font-mono">{cat.slug}</TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-xs truncate">{cat.description || '—'}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" size="icon"
                            className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            onClick={() => {
                              setEditing({ id: cat._id as Id<'newsCategories'>, name: cat.name, description: cat.description })
                              setEditName(cat.name)
                              setEditDescription(cat.description || '')
                            }}
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => handleDelete(cat._id as Id<'newsCategories'>)}
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

            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {filtered.map((cat) => (
                <div key={cat._id} className="p-4 flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900">{cat.name}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600"
                        onClick={() => {
                          setEditing({ id: cat._id as Id<'newsCategories'>, name: cat.name, description: cat.description })
                          setEditName(cat.name)
                          setEditDescription(cat.description || '')
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600"
                        onClick={() => handleDelete(cat._id as Id<'newsCategories'>)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">{cat.slug}</div>
                  {cat.description && <div className="text-sm text-gray-500">{cat.description}</div>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Category</h3>
            <div className="space-y-3">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Category name"
                className="h-11 rounded-xl"
              />
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description (optional)"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditing(null)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
