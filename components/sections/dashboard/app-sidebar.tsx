'use client'

import React from 'react'
import { BookOpen, ClipboardList, CircleUser, Globe, ArrowLeft } from 'lucide-react'
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
  SidebarGroup,
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
    <Sidebar variant="inset" {...props} className="border-r border-gray-100 bg-white/40 backdrop-blur-md">
      <SidebarHeader className="border-b border-gray-100/60 pb-4 pt-6 px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent justify-center mb-2">
              <Link href="/dashboard">
                <Image
                  src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
                  alt="Logo"
                  width={124}
                  height={24}
                  className="w-auto h-auto transition-transform hover:scale-105 duration-500"
                  priority
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 scrollbar-none">
        <SidebarGroup className="pt-6 pb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                tooltip="Return to Website" 
                className="bg-indigo-50/60 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 border border-indigo-100/50 shadow-sm transition-all rounded-xl h-10 group"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-1 text-indigo-500 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-semibold text-sm">Return to Website</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-100/60 p-4">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
