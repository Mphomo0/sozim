'use client'

import React from 'react'
import { BookOpen, ClipboardList, CircleUser } from 'lucide-react'
import { NavMain } from '@/components/sections/dashboard/nav-main'
import { NavUser } from '@/components/sections/dashboard/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Image from 'next/image'
import Link from 'next/link'

const data = {
  navMain: [
    {
      title: 'Applications',
      url: '#',
      icon: ClipboardList,
      isActive: true,
      items: [
        {
          title: 'Add New',
          url: '/dashboard/admin/applications/new',
        },
        {
          title: 'View All',
          url: '/dashboard/admin/applications',
        },
      ],
    },
    {
      title: 'Users',
      url: '#',
      icon: CircleUser,
      items: [
        {
          title: 'Add New',
          url: '/dashboard/admin/users/new',
        },

        {
          title: 'View Users',
          url: '/dashboard/admin/users',
        },
      ],
    },

    {
      title: 'Courses',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'View Courses',
          url: '/dashboard/admin/courses',
        },
        {
          title: 'Course Categories',
          url: '/dashboard/admin/courses/category',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <Image
                  src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
                  alt="Logo"
                  width={116}
                  height={20}
                  className="mt-2 w-auto h-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
