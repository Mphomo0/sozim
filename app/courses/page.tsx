import PageHeader from '@/components/global/PageHeader'
import OurPrograms from '@/components/sections/programs/OurPrograms'

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Our Programs"
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <OurPrograms />
    </>
  )
}
