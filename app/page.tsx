import CTA from '@/components/global/CTA'
import Featured from '@/components/sections/home/Featured'
import Hero from '@/components/sections/home/Hero'
import SozimPrograms from '@/components/sections/home/SozimPrograms'
import Stats from '@/components/sections/home/Stats'

export default function Home() {
  return (
    <div className="mb-0">
      <Hero />
      <Stats />
      <Featured />
      <SozimPrograms />
      <CTA />
    </div>
  )
}
