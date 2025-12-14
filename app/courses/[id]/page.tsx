import CourseDetail from '@/components/sections/programs/CourseDetail'
import PageHeader from '@/components/global/PageHeader'

export default function SingleCourse() {
  return (
    <>
      <PageHeader
        title="Course Details"
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <CourseDetail />
    </>
  )
}
