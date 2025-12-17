import PageHeader from '@/components/global/PageHeader'
import CallbackForm from '@/components/sections/contact/CallbackForm'

export default function ContactMe() {
  return (
    <>
      <PageHeader
        title="Contact Me"
        details="Please provide your contact details, and a Student Recruitment Advisor will reach out to you shortly."
      />
      <CallbackForm />
    </>
  )
}
