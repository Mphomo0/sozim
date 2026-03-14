'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold text-indigo-900/50 uppercase tracking-wider mb-2">Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if any sub-item is active to keep collapsible open, only on client to prevent hydration mismatch
          const isItemActive = mounted 
            ? item.items?.some(subItem => pathname.startsWith(subItem.url))
            : false
          
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive || isItemActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
                  <a href={item.url}>
                    <item.icon className="text-indigo-600" />
                    <span className="font-medium">{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90 hover:bg-indigo-100 hover:text-indigo-900 text-gray-500 transition-colors">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l-indigo-100 pr-0 mr-0">
                        {item.items?.map((subItem) => {
                          // Exact match or starting with for sub-routes, only calculate on client
                          const isSubActive = mounted 
                            ? (pathname === subItem.url || (subItem.url !== '/dashboard/admin' && pathname.startsWith(subItem.url + '/')))
                            : false
                          
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isSubActive}
                                className={`transition-all mt-1 ${isSubActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:text-indigo-700 hover:bg-indigo-50/50 font-medium'}`}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
