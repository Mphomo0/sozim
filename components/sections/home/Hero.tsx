'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SignUpButton } from '@clerk/nextjs'

const SLIDES = [
  {
    image: 'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
    title: 'Transform Your Future',
    description: 'Join thousands of students achieving their dreams through world-class education.',
    ctaText: 'Explore Courses',
    ctaLink: '/courses',
  },
  {
    image: 'https://ik.imagekit.io/vzofqg2fg/images/hero3.webp',
    title: 'Expert Led Trading',
    description: 'Learn from industry pros and master the markets with our structured pathways.',
    ctaText: 'View Pathways',
    ctaLink: '/career-pathway',
  },
  {
    image: 'https://ik.imagekit.io/vzofqg2fg/images/hero2.webp',
    title: 'Global Opportunities',
    description: 'Connect with a network of learners and potential employers.',
    ctaText: 'Join Sozim',
    ctaLink: '/contact-learning',
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrent((prev) => (prev + newDirection + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000)
    return () => clearInterval(timer)
  }, [paginate])

  return (
    <section className="relative h-[600px] md:h-[900px] flex items-center justify-center overflow-hidden bg-slate-950">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
           key={current}
           custom={direction}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
           className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${SLIDES[current].image}')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-display mb-6 drop-shadow-lg text-white">
              {SLIDES[current].title}
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-blue-5/90 font-light drop-shadow-md">
              {SLIDES[current].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {SLIDES[current].ctaLink === '/register' ? (
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-lg h-14 px-8 rounded-full shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                    {SLIDES[current].ctaText}
                  </Button>
                </SignUpButton>
              ) : (
                <Button size="lg" asChild className="text-lg h-14 px-8 rounded-full shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                  <Link href={SLIDES[current].ctaLink}>{SLIDES[current].ctaText}</Link>
                </Button>
              )}
              <Button size="lg" variant="secondary" asChild className="text-lg h-14 px-8 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation */}
      <div className="absolute inset-x-0 bottom-12 z-20 flex justify-center gap-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > current ? 1 : -1)
              setCurrent(idx)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-sm hover:bg-white/10 transition-colors hidden md:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 z-20 p-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-sm hover:bg-white/10 transition-colors hidden md:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Premium subtle bottom gradient transition */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
