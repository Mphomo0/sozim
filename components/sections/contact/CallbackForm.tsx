'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'

const callbackSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.email('Invalid email address'),
  cellphoneNumber: z.string().min(1, 'Cellphone Number is required'),
  alternativeContactNumber: z.string().optional(),
  natureOfEnquiry: z.enum(['General Inquiry', 'School Specific']),
  schoolOf: z.enum([
    'School of Arts and Humanities',
    'School of Education',
    'ETDP SETA Skills Programmes',
  ]),
  contactMethod: z.enum(['Email', 'Phone', 'SMS', 'WhatsApp']),
  preferredContactTime: z.enum(['Morning', 'Afternoon', 'Evening']),
  message: z.string().min(1, 'Message is required'),
})

type CallbackFormData = z.infer<typeof callbackSchema>

export default function CallbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      firstName: '',
      surname: '',
      email: '',
      cellphoneNumber: '',
      alternativeContactNumber: '',
      natureOfEnquiry: 'General Inquiry',
      schoolOf: 'School of Arts and Humanities',
      contactMethod: 'Email',
      preferredContactTime: 'Morning',
      message: '',
    },
  })

  const onSubmit = async (data: CallbackFormData) => {
    setIsSubmitting(true)

    const formData = { ...data, formType: 'callback' }

    try {
      const res = await fetch('/api/send-mails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to send message')

      alert('Message sent successfully!')
      reset()
    } catch (err) {
      console.error(err)
      alert('Error sending message')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-24 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 right-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/3 rounded-full bg-blue-100/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/2 -translate-x-1/3 rounded-full bg-sky-100/30 blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10 mx-auto px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl mx-auto p-8 md:p-12 bg-white/80 backdrop-blur-md shadow-2xl rounded-[32px] border border-slate-200/60 space-y-8 relative group"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-sky-400" />
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Callback Request
            </h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto">
              Fill in your details and our team will get back to you at your preferred time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">First Name</label>
              <input
                {...register('firstName')}
                placeholder="John"
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Surname */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Surname</label>
              <input
                {...register('surname')}
                placeholder="Doe"
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                  errors.surname ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.surname && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.surname.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="john.doe@example.com"
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">{errors.email.message}</p>
              )}
            </div>

            {/* Cellphone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Cellphone Number
              </label>
              <input
                {...register('cellphoneNumber')}
                placeholder="+27 XX XXX XXXX"
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                  errors.cellphoneNumber ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              />
              {errors.cellphoneNumber && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.cellphoneNumber.message}
                </p>
              )}
            </div>

            {/* Alternative Contact Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Alternative Contact Number
              </label>
              <input
                {...register('alternativeContactNumber')}
                placeholder="Optional"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              />
            </div>

            {/* Nature of Enquiry */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Nature of Enquiry
              </label>
              <select
                {...register('natureOfEnquiry')}
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat ${
                  errors.natureOfEnquiry ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Select Nature of Enquiry</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="School Specific">School Specific</option>
              </select>
              {errors.natureOfEnquiry && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.natureOfEnquiry.message}
                </p>
              )}
            </div>

            {/* School of */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">School of</label>
              <select
                {...register('schoolOf')}
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat ${
                  errors.schoolOf ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Select School</option>
                <option value="School of Arts and Humanities">
                  School of Arts and Humanities
                </option>
                <option value="School of Education">School of Education</option>
                <option value="ETDP SETA Skills Programmes">
                  ETDP SETA Skills Programmes
                </option>
              </select>
              {errors.schoolOf && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.schoolOf.message}
                </p>
              )}
            </div>

            {/* Contact Method */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Preferred Contact Method
              </label>
              <select
                {...register('contactMethod')}
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat ${
                  errors.contactMethod ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Select Contact Method</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="SMS">SMS</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
              {errors.contactMethod && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.contactMethod.message}
                </p>
              )}
            </div>

            {/* Preferred Contact Time */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">
                Preferred Contact Time
              </label>
              <select
                {...register('preferredContactTime')}
                className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat ${
                  errors.preferredContactTime ? 'border-red-500 bg-red-50' : 'border-slate-200'
                }`}
              >
                <option value="">Select Contact Time</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>
              {errors.preferredContactTime && (
                <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                  {errors.preferredContactTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Message</label>
            <textarea
              {...register('message')}
              rows={4}
              placeholder="How can we help you achieve your goals?"
              className={`w-full px-5 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${
                errors.message ? 'border-red-500 bg-red-50' : 'border-slate-200'
              }`}
            />
            {errors.message && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-pulse">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-16 text-xl font-extrabold rounded-2xl transition-all duration-500 shadow-xl hover:-translate-y-1 ${
              isSubmitting
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 translate-y-0 shadow-none'
                : 'bg-gradient-to-r from-slate-900 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-blue-900/20 hover:shadow-blue-500/30'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
