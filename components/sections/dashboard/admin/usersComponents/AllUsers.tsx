'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Pagination } from '@/components/global/Pagination'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const loadUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/users?page=${currentPage}&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.users)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [currentPage, limit]) // 3. Dependencies for useCallback

  useEffect(() => {
    loadUsers()
  }, [currentPage, limit, loadUsers]) // The dependency array is now correct!

  useEffect(() => {
    loadUsers()
  }, [currentPage, limit, loadUsers])

  async function handleDeleteUser(_id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const res = await fetch(`/api/users/${_id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
      toast.success('User deleted successfully')
      loadUsers()
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete user')
    }
  }

  if (loading) {
    return <div className="text-center py-16">Loading users...</div>
  }

  if (users.length === 0) {
    return <div className="text-center py-16">No users found.</div>
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 px-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user._id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/admin/users/edit/${user._id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit user ${user._id}`}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Pencil size={18} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete user with this email: ${user.email}`}
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="py-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            limit={limit}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setCurrentPage(1) // Reset to page 1 when limit changes
            }}
            showLimitSelector={true}
          />
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="border rounded-lg p-4 shadow-sm bg-white flex flex-col gap-2"
          >
            <div>
              <span className="font-semibold">ID: </span>
              {user._id}
            </div>
            <div>
              <span className="font-semibold">First Name: </span>
              {user.firstName}
            </div>
            <div>
              <span className="font-semibold">Last Name: </span>
              {user.lastName}
            </div>
            <div>
              <span className="font-semibold">Email: </span>
              {user.email}
            </div>
            <div>
              <span className="font-semibold">Phone: </span>
              {user.phone}
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Link href={`/dashboard/admin/users/edit/${user._id}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit user ${user._id}`}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <Pencil size={18} />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete user with this email: ${user.email}`}
                onClick={() => handleDeleteUser(user._id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
