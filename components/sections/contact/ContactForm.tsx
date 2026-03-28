'use client'

import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?\d+$/, 'Phone number must contain only digits or start with +'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
})

type ContactFormData = z.infer<typeof contactFormSchema>

// Mapping select values to human-readable labels
const subjectLabels: Record<string, string> = {
  general: 'General Inquiry',
  admissions: 'Admissions',
  programs: 'Program Information',
  support: 'Student Support',
  other: 'Other',
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    const formData = {
      ...data,
      subject: subjectLabels[data.subject] || data.subject,
      formType: 'contact',
    }

    try {
      const res = await fetch('/api/send-mails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to send message')

      alert('Message sent successfully!')
    } catch (err) {
      console.error(err)
      alert('Error sending message')
    }
  }

  return (
    <div>
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-sky-400" />
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
            Send us a Message
          </CardTitle>
          <CardDescription className="text-lg text-slate-500 font-light">
            Fill out the form below and we&lsquo;ll get back to you within 24
            hours
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-xs font-bold text-red-500 mt-1 ml-1 animate-pulse">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  className="h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-xs font-bold text-red-500 mt-1 ml-1 animate-pulse">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                className="h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-1 animate-pulse">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+27 XX XXX XXXX"
                className="h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-1 animate-pulse">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Subject *</Label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="subject" className="w-full h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="admissions">Admissions</SelectItem>
                      <SelectItem value="programs">
                        Program Information
                      </SelectItem>
                      <SelectItem value="support">Student Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-1 animate-pulse">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell us how we can help you..."
                className="min-h-[160px] bg-slate-50/50 border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                {...register('message')}
              />
              {errors.message && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-1 animate-pulse">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-slate-900 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
              disabled={isSubmitting}
            >
              <Send className="mr-3 h-5 w-5" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
