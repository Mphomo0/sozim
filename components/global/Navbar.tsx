'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  // This state is now used by the onMouseEnter/onMouseLeave handlers below
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    {}
  )

  const { data: session } = useSession()

  const topMenuItems = [
    { label: 'Apply Now', href: '/student' },
    { label: 'Call Me Back', href: '/callback' },
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
              href: '#',
            },
          ],
        },
        {
          title: 'School of Education',
          links: [
            {
              label:
                'Occupational Skills Programme: Learning and Development Facilitator',
              href: '#',
            },
            {
              label: 'Occupational Skills Programme: Assessment Practitioner',
              href: '#',
            },
          ],
        },
        { title: 'ETDP SETA Skills Programmes', href: '#' },
        { title: 'Outcome-Based Assessment', href: '#' },
        {
          title: 'Facilitation Using a Variety of Given Methodologies',
          href: '#',
        },
        { title: 'Conduct Outcome-Based Moderation', href: '#' },
      ],
    },
    { label: 'Library', href: '#' },
    { label: 'Contact Learning', href: '#' },
    { label: 'Campus', href: '#' },
    { label: 'Career Pathways', href: '/career-pathway' },
    { label: 'Sozim Store', href: '#' },
  ]

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const isDropdownOpen = (label: string) => openDropdowns[label] || false

  return (
    <header className="relative z-50 bg-white border-b border-gray-300 tracking-wide">
      {/* Top Section */}
      <section className="flex flex-wrap items-center gap-4 py-2 px-4 sm:px-10 min-h-[70px] border-b border-gray-300">
        {/* Logo */}
        <Link href="/" className="max-sm:hidden">
          <Image
            src="https://ik.imagekit.io/e2pess7p4/application/SozimLogo.webp"
            alt="logo"
            width={250}
            height={80}
            className="w-auto h-auto object-contain "
            priority
            unoptimized
          />
        </Link>
        <Link href="/" className="hidden max-sm:block">
          <Image
            src="https://ik.imagekit.io/e2pess7p4/application/SozimLogo.webp"
            alt="logo"
            width={180}
            height={70}
            className="w-auto h-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* Top Menu */}
        <ul className="flex space-x-8 max-lg:hidden lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 space-y-10">
          {topMenuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-[15px] font-medium text-slate-900 hover:text-blue-900"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section: Login + Search */}
        <div className="flex items-center ml-auto space-x-4 lg:absolute lg:right-10">
          {session ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-[15px] font-medium text-white bg-blue-900 rounded-full hover:bg-blue-700"
              >
                Dashboard
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-[15px] font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-[15px] font-medium text-white bg-blue-900 rounded-full hover:bg-blue-700"
            >
              Student Login
            </Link>
          )}

          {/* Expandable Search */}
          <div
            className={`relative transition-all duration-300 ${
              searchActive ? 'w-60' : 'w-10'
            }`}
          >
            <input
              id="search"
              type="text"
              placeholder="Search..."
              className={`absolute left-0 top-0 h-10 w-full py-1.5 pl-10 pr-3 text-[14px] rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all duration-300 ${
                searchActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setTimeout(() => setSearchActive(false), 150)}
            />
            <button
              onClick={() => setSearchActive(true)}
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:border-blue-500 transition"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
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
                src="/images/logo/sozimLogo.webp"
                alt="logo"
                width={144}
                height={30}
                className="w-auto h-auto"
              />
            </li>

            {mainMenuItems.map((item) =>
              item.dropdown ? (
                <li
                  key={item.label}
                  className="relative max-lg:border-b border-blue-200 max-lg:py-3"
                  // FIX: Use the state setter to open dropdown on hover for desktop
                  onMouseEnter={() => {
                    if (item.label === 'Academic Schools') {
                      setIsDesktopDropdownOpen(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.label === 'Academic Schools') {
                      setIsDesktopDropdownOpen(false)
                    }
                  }}
                >
                  {/* Desktop Dropdown */}
                  {isDesktopDropdownOpen &&
                    item.label === 'Academic Schools' && (
                      <ul className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:mt-0 lg:min-w-[300px] lg:bg-white lg:border lg:border-gray-200 lg:shadow-xl lg:rounded lg:p-4 lg:space-y-2 lg:transition-all lg:duration-200 lg:z-50">
                        {item.dropdown.map((sub, index) => (
                          <li
                            key={index}
                            className="pb-2 border-b border-gray-100 last:border-b-0"
                          >
                            <Link
                              href={sub.href || '#'}
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
                    href={'#'} // Use '#' or the first link in the dropdown as the main link
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
                            href={sub.href || '#'}
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
                    className="block text-[15px] font-medium text-slate-500 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </li>
              )
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
