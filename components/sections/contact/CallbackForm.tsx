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
    <div className="py-24">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Callback Request
        </h2>

        {/* First Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">First Name</label>
          <input
            {...register('firstName')}
            placeholder="Your First Name"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Surname */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Surname</label>
          <input
            {...register('surname')}
            placeholder="Your Surname"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.surname ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.surname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.surname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Your Email"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Cellphone Number */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Cellphone Number
          </label>
          <input
            {...register('cellphoneNumber')}
            placeholder="Your Cellphone Number"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cellphoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cellphoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cellphoneNumber.message}
            </p>
          )}
        </div>

        {/* Alternative Contact Number */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Alternative Contact Number
          </label>
          <input
            {...register('alternativeContactNumber')}
            placeholder="Your Alternative Contact Number"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nature of Enquiry */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Nature of Enquiry
          </label>
          <select
            {...register('natureOfEnquiry')}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.natureOfEnquiry ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Nature of Enquiry</option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="School Specific">School Specific</option>
          </select>
          {errors.natureOfEnquiry && (
            <p className="text-red-500 text-sm mt-1">
              {errors.natureOfEnquiry.message}
            </p>
          )}
        </div>

        {/* School of */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">School of</label>
          <select
            {...register('schoolOf')}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.schoolOf ? 'border-red-500' : 'border-gray-300'
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
            <p className="text-red-500 text-sm mt-1">
              {errors.schoolOf.message}
            </p>
          )}
        </div>

        {/* Contact Method */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Preferred Contact Method
          </label>
          <select
            {...register('contactMethod')}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactMethod ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Contact Method</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="SMS">SMS</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
          {errors.contactMethod && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contactMethod.message}
            </p>
          )}
        </div>

        {/* Preferred Contact Time */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Preferred Contact Time
          </label>
          <select
            {...register('preferredContactTime')}
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.preferredContactTime ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Contact Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
          {errors.preferredContactTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.preferredContactTime.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Message</label>
          <textarea
            {...register('message')}
            rows={5}
            placeholder="Enter your message"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full font-semibold py-3 rounded-md transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
