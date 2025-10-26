import PageHeader from '@/components/global/PageHeader'
import Accreditation from '@/components/sections/about/Accreditation'
import Achievements from '@/components/sections/about/Achievements'
import Leadership from '@/components/sections/about/Leadership'
import MissionVision from '@/components/sections/about/MissionVision'
import OurStory from '@/components/sections/about/OurStory'
import Values from '@/components/sections/about/Values'

export default function About() {
  return (
    <>
      <PageHeader
        title="About Sozim"
        details="Empowering students through quality education and training. We are dedicated to transforming lives and building successful careers.."
      />
      <MissionVision />
      <Values />
      <Achievements />
      <OurStory />
      <Leadership />
      <Accreditation />
    </>
  )
}
