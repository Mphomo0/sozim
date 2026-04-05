'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'
import EmailLink from '@/components/ui/EmailLink'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          <div className="space-y-6">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
              <Image
                src="https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp"
                alt="Logo"
                width={150}
                height={80}
                className="w-auto h-auto"
                priority
                unoptimized
              />
            </Link>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Sozim Trading and Consultancy stands for quality, excellent products, highly efficient processes and outstanding results.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-8 tracking-tight">Quick Links</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-8 tracking-tight">Programs</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">Undergraduate</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">Graduate</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">Online Learning</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-400 transition-colors">Certificates</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-8 tracking-tight">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email Us</p>
                  <span className="text-white font-medium text-sm">admin@sozim.co.za</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Call Support</p>
                  <span className="text-white font-medium text-sm">(+27) 83 668 0104</span>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Location</p>
                  <span className="text-white font-medium text-sm leading-relaxed">
                    Shop 4,Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 text-center">
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Sozim Trading and Consultancy. All rights reserved. 
            <br className="md:hidden" /> Developed by <a href="https://nostalgic-studio.co.za" className="hover:text-blue-500 transition-colors">Nostalgic Studio</a>.
          </p>
        </div>
      </div>
    </footer>
  )
}
