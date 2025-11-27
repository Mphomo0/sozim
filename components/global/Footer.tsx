'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <Image
                src="https://ik.imagekit.io/e2pess7p4/application/SozimLogo.webp?tr=w-150,h-150,q-80"
                alt="Logo"
                width={150}
                height={150}
                className="w-auto h-auto"
                priority
                unoptimized
              />
            </Link>
            <p className="text-sm text-stone-50">
              Sozim Trading and Consultancy stands for quality, excellent
              products, highly efficient processes and outstanding results.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-stone-50">Quick Links</h3>
            <ul className="space-y-2 text-sm text-stone-50">
              <li>
                <Link href="/" className="hover:text-sky-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-sky-500 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-sky-500 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-sky-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-stone-50">Programs</h3>
            <ul className="space-y-2 text-sm text-stone-50">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-sky-500 transition-colors"
                >
                  Undergraduate
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-sky-500 transition-colors"
                >
                  Graduate
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-sky-500 transition-colors"
                >
                  Online Learning
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-sky-500 transition-colors"
                >
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-stone-50">Contact Us</h3>

            <ul className="space-y-3 text-sm text-stone-50">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-white" />
                <span>admin@sozim.co.za</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-white" />
                <span>(+27) 83 668 0104</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-white" />
                <span>(+27) 72 302 3929</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-6 w-6 mt-0.5 text-white" />
                <span>
                  4697 Modiko Street, Bochabela Location, Mangaung, 9323
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Excellence University. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
