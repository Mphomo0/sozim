'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'

interface DropdownLink {
  label: string
  href: string
}

interface DropdownGroup {
  title: string
  href?: string
  links?: DropdownLink[]
}

interface MainMenuItem {
  label: string
  href?: string
  dropdown?: DropdownGroup[]
}

interface TopMenuItem {
  label: string
  href: string
}

interface MobileMenuProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  mainMenuItems: MainMenuItem[]
  topMenuItems: TopMenuItem[]
  isActive: (href: string) => boolean
  toggleDropdown: (label: string) => void
  isDropdownOpen: (label: string) => boolean
  toggleDesktopDropdown: (label: string, state: boolean) => void
  isDesktopOpen: (label: string) => boolean
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  mainMenuItems,
  topMenuItems,
  isActive,
  toggleDropdown,
  isDropdownOpen,
  toggleDesktopDropdown,
  isDesktopOpen,
}: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mql = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsMobileViewport(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  const panelClosed = isMobileViewport && !isOpen

  const desktopDropdownMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 },
      }
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { type: 'spring' as const, bounce: 0, duration: 0.3 },
      }

  const mobileAccordionMotion = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 },
      }
    : {
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { type: 'spring' as const, bounce: 0, duration: 0.3 },
      }

  {
    /* Close Button — shared by both render paths */
  }
  const closeButton = (
    <button
      aria-label="Close Menu"
      className="lg:hidden fixed top-2 right-4 z-50 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full bg-white"
      onClick={() => setIsOpen(false)}
    >
      ✕
    </button>
  )

  {
    /* Menu Items — shared by both render paths */
  }
  const menuItemsContent = (
    <ul className="lg:flex lg:justify-center gap-x-8 max-lg:space-y-3">
      <li className="mb-6 hidden max-lg:block">
        <Image
          src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
          alt="logo"
          width={80}
          height={42}
          className="w-full h-full object-contain"
          priority
          unoptimized
        />
      </li>

      {/* Mobile Top Menu Links (Appears only on mobile/tablet) */}
      <li className="lg:hidden">
        <div className="flex flex-col gap-2 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          {topMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              prefetch={false}
              onClick={() => setIsOpen(false)}
              className={`block text-[14px] font-semibold transition py-1.5 ${
                isActive(item.href)
                  ? 'text-blue-900'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </li>

      {mainMenuItems.map((item) =>
        item.dropdown ? (
          <li
            key={item.label}
            className="relative max-lg:border-b border-blue-200 max-lg:py-3"
            onMouseEnter={() => toggleDesktopDropdown(item.label, true)}
            onMouseLeave={() => toggleDesktopDropdown(item.label, false)}
          >
            {/* Desktop Dropdown */}
            <AnimatePresence>
              {isDesktopOpen(item.label) && (
                <motion.ul
                  key="desktop-dropdown"
                  className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:mt-0 lg:min-w-75 lg:bg-white lg:border lg:border-gray-200 lg:shadow-xl lg:rounded lg:p-4 lg:space-y-2 lg:z-50"
                  style={{ transformOrigin: 'top center' }}
                  {...desktopDropdownMotion}
                >
                  {item.dropdown.map((sub, index) => (
                    <li
                      key={index}
                      className="pb-2 border-b border-gray-100 last:border-b-0"
                    >
                      <Link
                        href={sub.href || sub.links?.[0]?.href || '#'}
                        prefetch={false}
                        className="block text-[14px] font-bold text-blue-900 hover:text-blue-700"
                      >
                        {sub.title}
                      </Link>

                      {sub.links && (
                        <ul className="pl-3 mt-1 space-y-1">
                          {sub.links.map((link, i) => (
                            <li key={i}>
                              <Link
                                href={link.href}
                                prefetch={false}
                                className="block text-[13px] text-slate-500 hover:text-blue-700 transition"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            {/* Desktop/Mobile Link */}
            <Link
              href={item.dropdown?.[0]?.links?.[0]?.href || '#'}
              prefetch={false}
              className="hidden lg:block text-[15px] font-medium text-slate-500 hover:text-blue-600"
            >
              {item.label}
            </Link>

            {/* Mobile Dropdown Button */}
            <button
              onClick={() => toggleDropdown(item.label)}
              className="flex lg:hidden items-center justify-between w-full text-[15px] font-medium text-slate-500 hover:text-blue-600"
            >
              {item.label}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isDropdownOpen(item.label) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Mobile Dropdown Content */}
            <AnimatePresence>
              {isDropdownOpen(item.label) && (
                <motion.ul
                  key="mobile-accordion"
                  className="lg:hidden mt-3 ml-3 p-2 bg-blue-50 rounded-lg space-y-2"
                  {...mobileAccordionMotion}
                >
                  {item.dropdown.map((sub, index) => (
                    <li
                      key={index}
                      className="border-b border-blue-100 last:border-b-0"
                    >
                      <Link
                        href={sub.href || sub.links?.[0]?.href || '#'}
                        prefetch={false}
                        className="block text-[14px] font-bold text-blue-800 hover:text-blue-600 py-1"
                      >
                        {sub.title}
                      </Link>

                      {sub.links && (
                        <ul className="pl-3 mt-1 space-y-1 pb-1">
                          {sub.links.map((link, i) => (
                            <li key={i}>
                              <Link
                                href={link.href}
                                prefetch={false}
                                className="block text-[13px] text-slate-500 hover:text-blue-700 transition"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ) : (
          <li
            key={item.label}
            className="max-lg:border-b border-blue-200 max-lg:py-3"
          >
            <Link
              href={item.href ?? '#'}
              prefetch={false}
              className={`block text-[15px] font-medium transition ${
                isActive(item.href ?? '#')
                  ? 'text-blue-900 font-semibold max-lg:border-b-0 lg:border-b-2 lg:border-blue-900'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ),
      )}
    </ul>
  )

  // Pre-mount (server render + the client's first render): plain CSS only.
  // Correct from the very first paint with zero dependency on client state,
  // so there is no flash of an on-screen panel and no hydration mismatch.
  if (!mounted) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
        <nav
          className={`w-full lg:block max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-72 max-lg:max-w-[85vw] max-lg:h-full max-lg:bg-white max-lg:p-6 max-lg:shadow-md max-lg:overflow-auto max-lg:transition-transform max-lg:duration-300 z-50 ${
            isOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
          }`}
        >
          {closeButton}
          {menuItemsContent}
        </nav>
      </>
    )
  }

  // Post-mount: full spring physics. On mobile the backdrop/panel are `fixed`,
  // so they are portalled to document.body to escape the header's
  // `backdrop-filter` containing block. On desktop the <nav> is a static flex
  // child of the header's nav row, so it must stay inline — portalling it would
  // move the whole desktop menu to the end of the document.
  const enhancedMenu = (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            className="fixed inset-0 bg-black z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.25 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav
        className={`w-full lg:block max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-72 max-lg:max-w-[85vw] max-lg:h-full max-lg:bg-white max-lg:p-6 max-lg:shadow-md max-lg:overflow-auto z-50 ${
          panelClosed ? 'pointer-events-none' : ''
        }`}
        initial={false}
        animate={
          shouldReduceMotion
            ? { opacity: panelClosed ? 0 : 1 }
            : { x: panelClosed ? '-100%' : 0 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.15 }
            : { type: 'spring', bounce: 0.2, duration: 0.3 }
        }
      >
        {closeButton}
        {menuItemsContent}
      </motion.nav>
    </>
  )

  return isMobileViewport
    ? createPortal(enhancedMenu, document.body)
    : enhancedMenu
}
