import PageHeader from '@/components/global/PageHeader'
import StudentApplication from '@/components/sections/application/StudentApplication'
import React from 'react'

export default function Apply() {
  return (
    <>
      <PageHeader
        title="Apply Now"
        details="Join Sozim and take the first step towards a brighter future. Our application process is simple and straightforward."
      />
      <StudentApplication />
    </>
  )
}
