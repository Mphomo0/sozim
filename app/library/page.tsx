import PageHeader from '@/components/global/PageHeader'
import { SearchHeader } from '@/components/sections/library/search-header'
import { SearchLayout } from '@/components/sections/library/search-layout'

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="Library"
        details="Choose from our wide range of industry-recognized programs designed to advance your career."
      />
      <SearchHeader />
      <SearchLayout />
    </>
  )
}
