import { Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="relative h-[500px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Static Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/student.jpg')",
        }}
      />

      {/* Dark Overlay (same as Hero) */}
      <div className="absolute inset-0 bg-blue-950/90" />

      {/* Foreground Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <Target className="mx-auto mb-4 h-10 w-10 sm:h-12 sm:w-12" />
        <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold">
          Ready to Start Your Journey?
        </h2>
        <p className="mb-8 text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Join our community of successful students and take the first step
          towards your dream career.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-base sm:text-lg"
          >
            <Link href="/apply">Apply Now</Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="text-base sm:text-lg border-white text-black hover:text-white hover:bg-white/10"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
