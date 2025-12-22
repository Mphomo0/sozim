'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { upload } from '@imagekit/next'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { formSchema, FormValues, DisabilityKey } from '@/lib/schema'

import CoPrincipalDebtorSection from '@/components/sections/application-form/CoPrincipalDebtorForm'
import StudyMaterial from '@/components/sections/application-form/StudyMaterial'
import ProgrammeDetails from '@/components/sections/application-form/ProgrammeDetails'
import NewProgrammeDetailsSection from '@/components/sections/application-form/NewProgrammeDetailsSection'
import DemographicsSection from '@/components/sections/application-form/DemographicsSection'
import SpecialNeedsSection from '@/components/sections/application-form/SpecialNeedsSection'
import StudentInformationSection from '@/components/sections/application-form/StudentInformationSection'

function disabilityPath(key: DisabilityKey) {
  return `disabilities.${key}` as const
}

export default function CreateApplication() {
  const { data: session, status } = useSession()

  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documents: [],
      qualifications: [
        {
          tertiaryQualification: 'certificate',
          tertiaryQualificationOther: '',
          tertiaryQualificationName: '',
          tertiaryInstitution: '',
          yearCommenced: '',
          YearCompletedTertiary: '',
        },
      ],
      user: {
        firstName: '',
        lastName: '',
        idNumber: '',
        phone: '',
        dob: '',
        alternativeNumber: '',
        email: '',
        address: '',
        nationality: '',
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'qualifications',
  })

  const watchSpecialNeeds = form.watch('specialNeeds')

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return

    form.reset((prev) => ({
      ...prev,
      user: {
        firstName: session.user.firstName ?? '',
        lastName: session.user.lastName ?? '',
        email: session.user.email ?? '',
        phone: session.user.phone ?? '',
        dob: session.user.dob ?? '',
        idNumber: session.user.idNumber ?? '',
        address: session.user.address ?? '',
        nationality: session.user.nationality ?? '',
        alternativeNumber: session.user.alternativeNumber ?? '',
      },
    }))
  }, [session, status, form])

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  /* -----------------------------
     FILE HANDLING (APPEND + DELETE)
  ------------------------------ */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles = Array.from(e.target.files)

    setSelectedFiles((prev) => (prev ? [...prev, ...newFiles] : newFiles))

    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) =>
      prev ? prev.filter((_, i) => i !== index) : prev
    )
  }

  async function onSubmit(values: FormValues) {
    try {
      if (!selectedFiles?.length) {
        toast.error('Please select at least one document.')
        return
      }

      setIsUploading(true)

      const uploadedDocs: { url: string; fileId: string }[] = []

      for (const file of selectedFiles) {
        const { token, signature, publicKey, expire } = await getAuthParams()

        const fileName = `${uuidv4()}_${file.name}`

        const res = await upload({
          file,
          fileName,
          folder: 'applications',
          token,
          signature,
          publicKey,
          expire,
        })

        if (res?.url && res?.fileId) {
          uploadedDocs.push({ url: res.url, fileId: res.fileId })
        }
      }

      if (!uploadedDocs.length) throw new Error('All uploads failed')

      let applicantId: string

      if (session?.user?.id) {
        applicantId = session.user.id
      } else {
        const userRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values.user),
        })

        const userData = await userRes.json()
        if (!userRes.ok) throw new Error(userData.message)

        applicantId = userData._id
      }

      const appRes = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          documents: uploadedDocs,
          applicantId,
        }),
      })

      if (!appRes.ok) {
        const err = await appRes.json()
        throw new Error(err.message)
      }

      toast.success('Application submitted successfully')
      form.reset()
      setSelectedFiles(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete='off'
          className='space-y-12 max-w-4xl mx-auto py-12 px-6 bg-white shadow-xl rounded-2xl'
        >
          <CoPrincipalDebtorSection form={form} />
          <StudyMaterial form={form} />

          <ProgrammeDetails
            form={form}
            fields={fields}
            append={append}
            remove={remove}
          />

          <NewProgrammeDetailsSection form={form} />
          <DemographicsSection form={form} />

          <SpecialNeedsSection
            form={form}
            watchSpecialNeeds={watchSpecialNeeds}
            disabilityPath={disabilityPath}
          />

          <StudentInformationSection
            form={form}
            isLoggedIn={status === 'authenticated'}
          />

          {/* FILE UPLOAD */}
          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Upload Documents
            </label>

            <label
              htmlFor='file-upload'
              className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition'
            >
              <p className='text-sm text-gray-600'>
                <span className='font-medium text-blue-600'>
                  Click to upload
                </span>
              </p>
            </label>

            <input
              id='file-upload'
              type='file'
              multiple
              accept='image/*,application/pdf'
              onChange={handleFileChange}
              className='hidden'
            />
          </div>

          {/* FILE PREVIEW */}
          {selectedFiles && (
            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
              {selectedFiles.map((file, index) => {
                const isImage = file.type.startsWith('image/')
                const previewUrl = URL.createObjectURL(file)

                return (
                  <div
                    key={index}
                    className='relative border rounded-lg p-2 bg-gray-50'
                  >
                    <button
                      type='button'
                      onClick={() => removeFile(index)}
                      className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
                    >
                      ✕
                    </button>

                    {isImage ? (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className='w-full h-32 object-cover rounded'
                      />
                    ) : (
                      <div className='flex items-center justify-center h-32 text-sm'>
                        {file.name}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <Button
            type='submit'
            disabled={isUploading}
            className='w-full text-lg'
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </>
  )
}
