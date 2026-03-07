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
import { Trash2, Pencil, Search, Users, Mail, Phone, ShieldCheck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Pagination } from '@/components/global/Pagination'
import { Badge } from '@/components/ui/badge'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
}

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/users?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`)
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
  }, [currentPage, limit, debouncedSearch])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  async function handleDeleteUser(_id: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-all shadow-sm rounded-xl"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <Link href="/dashboard/admin/users/new" passHref>
          <Button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 group"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {loading && users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            Loading system users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">No users found</p>
            <p className="text-gray-500">No results match your current search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold text-gray-900 h-14 pl-8">User Info</TableHead>
                  <TableHead className="font-bold text-gray-900 h-14">Contact</TableHead>
                  <TableHead className="font-bold text-gray-900 h-14">Role</TableHead>
                  <TableHead className="text-right font-bold text-gray-900 h-14 pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                    <TableCell className="pl-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 tracking-tight">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-gray-400 font-mono mt-1 uppercase">ID: {user._id.slice(-6)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-2 text-indigo-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-2 text-indigo-400" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.role === 'ADMIN' ? (
                        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-semibold">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 border-gray-200">
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 transition-opacity translate-x-2 duration-300">
                        <Link href={`/dashboard/admin/users/edit/${user._id}`} passHref>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                          >
                            <Pencil size={18} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={user.role === 'ADMIN'}
                          onClick={() => handleDeleteUser(user._id)}
                          className={`text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg ${
                            user.role === 'ADMIN' ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
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
        )}
        
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 bg-gray-50/30 mt-auto">
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
        )}
      </div>
    </div>
  )
}
