import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative h-[600px] md:h-[900px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('../../images/heroImage.jpg')` }}
      />
      <div className="absolute inset-0 bg-blue-950/90" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
          Transform Your Future
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Join thousands of students achieving their dreams through world-class
          education
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
          <Button size="lg" asChild className="text-lg">
            <Link href="/courses">Explore Courses</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild className="text-lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
