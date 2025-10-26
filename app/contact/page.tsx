import PageHeader from '@/components/global/PageHeader'
import ContactForm from '@/components/sections/contact/ContactForm'
import ContactsInfoCard from '@/components/sections/contact/ContactsInfoCard'
import InfoMap from '@/components/sections/contact/InfoMap'
import React from 'react'

export default function Contact() {
  return (
    <>
      <PageHeader
        title="Get in Touch"
        details="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />
      <ContactsInfoCard />
      <InfoMap />
    </>
  )
}
