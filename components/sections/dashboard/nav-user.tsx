'use client'

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react'
import { toast } from 'react-toastify'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useClerk, useUser } from '@clerk/nextjs'

export function NavUser() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { isMobile } = useSidebar()

  // Extract user information from the session
  const name = user?.firstName || 'Guest'
  const email = user?.primaryEmailAddress?.emailAddress || 'guest@example.com'
  const imgUrl = user?.imageUrl || undefined
  const userId = user?.id || 'guest'

  // Get initials for avatar fallback
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={imgUrl} alt={name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-gray-800">
                  {name}
                </span>
                <span className="truncate text-xs text-gray-500">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-500" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-gray-200"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={imgUrl} alt={name} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-gray-800">
                    {name}
                  </span>
                  <span className="truncate text-xs text-gray-500">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem asChild className="hover:bg-gray-100 cursor-pointer">
                <Link
                  href={`/dashboard/admin/users/edit/${userId}`}
                  className="flex items-center gap-2"
                >
                  <BadgeCheck className="h-4 w-4" />
                  <span>Account</span>
                </Link>
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-100" />
            <DropdownMenuItem
              className="hover:bg-red-50 text-red-600 cursor-pointer focus:text-red-700"
              onClick={() => {
                const confirmed = window.confirm(
                  'Are you sure you want to log out?'
                )
                if (confirmed) {
                  signOut({ redirectUrl: '/' })
                  toast.success('Logged out successfully!')
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
