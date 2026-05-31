'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
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

export function NewsTagManager() {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<{ id: Id<'newsTags'>; name: string } | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const tags = useQuery(api.newsTags.getNewsTags)
  const createTag = useMutation(api.newsTags.createNewsTag)
  const updateTag = useMutation(api.newsTags.updateNewsTag)
  const deleteTag = useMutation(api.newsTags.deleteNewsTag)

  const loading = tags === undefined
  const allTags = tags || []

  const filtered = allTags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!newName.trim()) return
    try {
      await createTag({ name: newName.trim(), description: newDescription.trim() || undefined })
      toast.success('Tag created')
      setNewName('')
      setNewDescription('')
    } catch (err) {
      toast.error('Failed to create tag')
    }
  }

  const handleUpdate = async () => {
    if (!editing || !editName.trim()) return
    try {
      await updateTag({ id: editing.id, name: editName.trim(), description: editDescription.trim() || undefined })
      toast.success('Tag updated')
      setEditing(null)
    } catch (err) {
      toast.error('Failed to update tag')
    }
  }

  const handleDelete = async (id: Id<'newsTags'>) => {
    if (!confirm('Delete this tag?')) return
    try {
      await deleteTag({ id })
      toast.success('Tag deleted')
    } catch (err) {
      toast.error('Failed to delete tag')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/50 border border-gray-100 p-6 rounded-2xl shadow-sm backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Add New Tag</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tag name"
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
            Loading tags...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No tags found</p>
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
                  {filtered.map((tag) => (
                    <TableRow key={tag._id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-900 pl-6">{tag.name}</TableCell>
                      <TableCell className="text-xs text-gray-400 font-mono">{tag.slug}</TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-xs truncate">{tag.description || '—'}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost" size="icon"
                            className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            onClick={() => {
                              setEditing({ id: tag._id as Id<'newsTags'>, name: tag.name })
                              setEditName(tag.name)
                              setEditDescription(tag.description || '')
                            }}
                          >
                            <Pencil size={18} />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="text-rose-600 hover:bg-rose-50 rounded-lg"
                            onClick={() => handleDelete(tag._id as Id<'newsTags'>)}
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
              {filtered.map((tag) => (
                <div key={tag._id} className="p-4 flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-gray-900">{tag.name}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600"
                        onClick={() => {
                          setEditing({ id: tag._id as Id<'newsTags'>, name: tag.name })
                          setEditName(tag.name)
                          setEditDescription(tag.description || '')
                        }}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600"
                        onClick={() => handleDelete(tag._id as Id<'newsTags'>)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">{tag.slug}</div>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Tag</h3>
            <div className="space-y-3">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Tag name"
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
