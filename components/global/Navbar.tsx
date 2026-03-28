'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useClerk, useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Search, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {},
  )
  const [desktopDropdowns, setDesktopDropdowns] = useState<
    Record<string, boolean>
  >({})

  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { signOut } = useClerk()

  const coursesReq = useQuery(api.courses.getCourses)
  const courses = coursesReq || []

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip',
  )

  useEffect(() => {
    const stored = localStorage.getItem('shopFavorites')
    if (stored) {
      const favs = JSON.parse(stored)
      setFavoritesCount(favs.length)
    }
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('shopFavorites')
      if (stored) {
        const favs = JSON.parse(stored)
        setFavoritesCount(favs.length)
      } else {
        setFavoritesCount(0)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    const checkFavorites = () => {
      const stored = localStorage.getItem('shopFavorites')
      if (stored) {
        const favs = JSON.parse(stored)
        setFavoritesCount(favs.length)
      } else {
        setFavoritesCount(0)
      }
    }

    window.addEventListener('focus', checkFavorites)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', checkFavorites)
    }
  }, [])

  const filteredResults = useMemo(() => {
    if (searchQuery.trim() === '') return []
    const query = searchQuery.toLowerCase()
    return courses
      .filter(
        (course: any) =>
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query),
      )
      .slice(0, 5)
  }, [searchQuery, courses])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`)
      setSearchActive(false)
      setSearchQuery('')
      setShowResults(false)
    }
  }

  const handleResultClick = (courseId: string) => {
    router.push(`/courses/${courseId}`)
    setSearchActive(false)
    setSearchQuery('')
    setShowResults(false)
  }

  const topMenuItems = [
    { label: 'Apply Now', href: '/apply' },
    { label: 'Call Me Back', href: '/call-me-back' },
    { label: 'Student Portal', href: '/portal' },
    { label: 'Contact Us', href: '/contact' },
  ]

  const mainMenuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    {
      label: 'Academic Schools',
      dropdown: [
        {
          title: 'School of Arts and Humanities',
          links: [
            {
              label: 'Occupational Certificate in Library Assistant',
              href: '/courses/jd7aetgjc0qs1p2x65b4dz8nax82e1dp',
            },
          ],
        },
        {
          title: 'School of Education',
          links: [
            {
              label: 'Learning and Development Facilitator',
              href: '/courses/jd73pdzr7by2fg8npqb4zvw5mh82fsw1',
            },
            {
              label: 'Assessment Practitioner',
              href: '/courses/jd74ajdjhj01hdrg48whbak7fd82ezzm',
            },
          ],
        },
        {
          title: 'ETDP SETA Skills Programmes',
          links: [
            {
              label: 'Outcome-Based Assessment',
              href: '/courses/jd7brhpjdrhzhnpb4kkyjpfnbs82fxmm',
            },
            {
              label: 'Facilitation Using Given Methodologies',
              href: '/courses/jd722pky3b0ykj0km73xnpkdd982frsa',
            },
            {
              label: 'Conduct Outcome-Based Moderation',
              href: '/courses/jd76nnzgs03836p1z0fes73dh582fhz1',
            },
          ],
        },
      ],
    },
    { label: 'Library', href: '/library' },
    { label: 'Contact Learning', href: '/contact-learning' },
    { label: 'Campus', href: '/campus' },
    { label: 'Career Pathways', href: '/career-pathway' },
    { label: 'Sozim Store', href: '/shop' },
    ...(favoritesCount > 0
      ? [{ label: `Favorites (${favoritesCount})`, href: '/favorites' }]
      : []),
  ]

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const toggleDesktopDropdown = (label: string, state: boolean) => {
    setDesktopDropdowns((prev) => ({
      ...prev,
      [label]: state,
    }))
  }

  const isDropdownOpen = (label: string) => openDropdowns[label] || false
  const isDesktopOpen = (label: string) => desktopDropdowns[label] || false

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="relative z-50 bg-white border-b border-gray-300 tracking-wide">
      {/* Top Section */}
      <section className="flex flex-wrap items-center gap-4 py-2 px-4 sm:px-10 min-h-[70px] border-b border-gray-300">
        {/* Logo */}
        <Link href="/" className="max-sm:hidden">
          <Image
            src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
            alt="logo"
            width={250}
            height={80}
            className="w-auto h-auto object-contain"
            priority
            unoptimized
          />
        </Link>
        <Link href="/" className="hidden max-sm:block">
          <Image
            src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
            alt="logo"
            width={180}
            height={70}
            className="w-auto h-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* Top Menu */}
        <ul className="flex space-x-8 max-lg:hidden lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
          {topMenuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`text-[15px] font-medium transition ${
                  isActive(item.href)
                    ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                    : 'text-slate-900 hover:text-blue-900'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section: Login + Search */}
        <div className="flex items-center ml-auto space-x-4 lg:absolute lg:right-10">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                href={convexUser?.role === 'ADMIN' ? '/dashboard' : '/student'}
                className="px-4 py-2 text-[15px] font-medium text-white bg-blue-900 rounded-full hover:bg-blue-700 transition"
              >
                {convexUser?.role === 'ADMIN' ? 'Dashboard' : 'Student Link'}
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-10 h-10',
                  },
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="px-4 py-2 text-[15px] font-medium text-white bg-blue-900 rounded-full hover:bg-blue-700">
                Student Login
              </button>
            </SignInButton>
          )}

          {/* Expandable Search */}
          <div
            className={`relative transition-all duration-300 ${
              searchActive ? 'w-72' : 'w-10'
            }`}
          >
            <form onSubmit={handleSearchSubmit}>
              <input
                id="search"
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowResults(true)
                }}
                onFocus={() => {
                  setSearchActive(true)
                  setShowResults(true)
                }}
                className={`absolute left-0 top-0 h-10 w-full py-1.5 pl-10 pr-3 text-[14px] rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all duration-300 ${
                  searchActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            </form>
            {searchActive && filteredResults.length > 0 && showResults && (
              <div className="absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                {filteredResults.map((course: any) => (
                  <button
                    key={course._id}
                    onClick={() => handleResultClick(course._id)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-gray-100 last:border-b-0 transition"
                  >
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">
                      {course.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {course.description?.substring(0, 60)}...
                    </p>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                if (searchQuery) {
                  router.push(
                    `/courses?search=${encodeURIComponent(searchQuery)}`,
                  )
                  setSearchActive(false)
                  setSearchQuery('')
                } else {
                  setSearchActive(true)
                }
              }}
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-blue-500 transition"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Navigation */}
      <div className="flex flex-wrap items-start gap-4 px-10 py-3 relative">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        <nav
          className={`w-full lg:block max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-1/2 max-lg:min-w-[300px] max-lg:h-full max-lg:bg-white max-lg:p-6 max-lg:shadow-md max-lg:overflow-auto max-lg:transition-transform max-lg:duration-300 z-50 ${
            isOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'
          }`}
        >
          {/* Close Button */}
          <button
            aria-label="Close Menu"
            className="lg:hidden fixed top-2 right-4 z-60 w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full bg-white"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          {/* Menu Items */}
          <ul className="lg:flex lg:justify-center gap-x-8 max-lg:space-y-3">
            <li className="mb-6 hidden max-lg:block">
              <Image
                src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp"
                alt="logo"
                width={144}
                height={30}
                className="w-auto h-auto"
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
                  {isDesktopOpen(item.label) && (
                    <ul className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:mt-0 lg:min-w-[300px] lg:bg-white lg:border lg:border-gray-200 lg:shadow-xl lg:rounded lg:p-4 lg:space-y-2 lg:transition-all lg:duration-200 lg:z-50">
                      {item.dropdown.map((sub, index) => (
                        <li
                          key={index}
                          className="pb-2 border-b border-gray-100 last:border-b-0"
                        >
                          <Link
                            href={sub.title || sub.links?.[0]?.href || '#'}
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
                    </ul>
                  )}

                  {/* Desktop/Mobile Link */}
                  <Link
                    href={item.dropdown?.[0]?.links?.[0]?.href || '#'}
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
                  {isDropdownOpen(item.label) && (
                    <ul className="lg:hidden mt-3 ml-3 p-2 bg-blue-50 rounded-lg space-y-2">
                      {item.dropdown.map((sub, index) => (
                        <li
                          key={index}
                          className="border-b border-blue-100 last:border-b-0"
                        >
                          <Link
                            href={sub.title || sub.links?.[0]?.href || '#'}
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
                    </ul>
                  )}
                </li>
              ) : (
                <li
                  key={item.label}
                  className="max-lg:border-b border-blue-200 max-lg:py-3"
                >
                  <Link
                    href={item.href}
                    className={`block text-[15px] font-medium transition ${
                      isActive(item.href)
                        ? 'text-blue-900 font-semibold border-b-2 border-blue-900'
                        : 'text-slate-500 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        {/* Hamburger */}
        <div className="flex ml-auto lg:hidden">
          <button
            aria-label="Open Menu"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer"
          >
            <svg
              className="w-7 h-7 fill-gray-800"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
