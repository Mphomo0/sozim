'use client'

import { useState, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Pencil, Search, Users, Mail, Phone, ShieldCheck, Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Pagination } from '@/components/global/Pagination'
import { Badge } from '@/components/ui/badge'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { deleteUserInClerk } from '@/app/actions/user.actions'

export default function AllUsers() {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const usersResponse = useQuery(api.users.getUsers, {})
  const deleteUser = useMutation(api.users.deleteUser)

  const loading = usersResponse === undefined
  const allUsers = usersResponse || []

  const result = searchTerm
    ? allUsers.filter(
        (u) =>
          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.clerkId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers

  const totalPages = Math.ceil(result.length / limit) || 1
  const validPage = currentPage > totalPages ? totalPages : currentPage
  const startIndex = (validPage - 1) * limit
  const users = result.slice(startIndex, startIndex + limit)

  async function handleDeleteUser(id: Id<'users'>) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    try {
      // Find the user to get their clerkId before destroying
      const userToDelete = allUsers.find(u => u._id === id)
      
      if (userToDelete?.clerkId) {
        const clerkRes = await deleteUserInClerk(userToDelete.clerkId)
        if (!clerkRes.success) {
           toast.error(clerkRes.error || "Cannot delete user from internal authenticator.")
           return
        }
      }

      await deleteUser({ id })
      toast.success('User deleted successfully')
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
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {/* Export buttons removed as requested */}
        </div>
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
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
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
                          <span className="text-[10px] text-indigo-500 font-mono mt-1 uppercase bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
                            CLERK: {user.clerkId || 'N/A'}
                          </span>
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
            
            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user._id} className="p-4 space-y-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-base">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[10px] text-indigo-500 font-mono mt-1 uppercase bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
                        CLERK: {user.clerkId || 'N/A'}
                      </span>
                    </div>
                    <div>
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
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-3 text-indigo-400" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-indigo-400" />
                      {user.phone || 'No phone provided'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                    <Link href={`/dashboard/admin/users/edit/${user._id}`} passHref className="flex-1">
                      <Button variant="outline" className="w-full h-10 text-indigo-600 hover:text-indigo-800 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all active:scale-[0.98]">
                        <Pencil size={16} className="mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={user.role === 'ADMIN'}
                      className={`h-10 w-10 text-rose-600 hover:text-rose-800 border-rose-100 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all active:scale-95 ${
                        user.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
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
