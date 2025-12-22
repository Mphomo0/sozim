'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import {
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  UploadCloud,
} from 'lucide-react'

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

type FileStatus = 'waiting' | 'uploading' | 'success' | 'error'

export default function CreateApplication() {
  const { data: session, status } = useSession()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [fileStatuses, setFileStatuses] = useState<{
    [key: string]: FileStatus
  }>({})

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

    const dob =
      session.user.dob instanceof Date
        ? session.user.dob
        : session.user.dob
        ? new Date(session.user.dob)
        : null

    form.reset((prev) => ({
      ...prev,
      user: {
        firstName: session.user.firstName ?? '',
        lastName: session.user.lastName ?? '',
        email: session.user.email ?? '',
        phone: session.user.phone ?? '',
        dob: dob ? dob.toISOString() : '',
        idNumber: session.user.idNumber ?? '',
        address: session.user.address ?? '',
        nationality: session.user.nationality ?? '',
        alternativeNumber: session.user.alternativeNumber ?? '',
      },
    }))
  }, [session, status, form])

  const getAuthParams = async () => {
    try {
      const res = await fetch('/api/images/upload-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to fetch upload auth')
      }

      return await res.json()
    } catch (error) {
      console.error('Error getting auth params:', error)
      throw error
    }
  }

  const uploadToImageKit = async (file: File) => {
    // 1. Get auth params from your API
    const authParams = await getAuthParams()

    const formData = new FormData()
    const fileName = `${uuidv4()}_${file.name}`

    // 2. Map these directly from the API response
    formData.append('file', file)
    formData.append('fileName', fileName)
    formData.append('folder', '/applications')
    formData.append('publicKey', authParams.publicKey)

    // CRITICAL: These three must match what the server used for the signature
    formData.append('signature', authParams.signature)
    formData.append('expire', authParams.expire.toString())
    formData.append('token', authParams.token)

    const response = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Upload failed')
    }

    return await response.json()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const files = Array.from(e.target.files)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/pdf',
    ]

    const validFiles: File[] = []
    const invalidFiles: string[] = []

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type)`)
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (too large - max 10MB)`)
      } else {
        validFiles.push(file)
      }
    })

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`)
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles])
      toast.success(`${validFiles.length} file(s) added`)
    }

    e.target.value = ''
  }

  const removeFile = (index: number) => {
    const fileName = selectedFiles[index].name
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setFileStatuses((prev) => {
      const newState = { ...prev }
      delete newState[fileName]
      return newState
    })
    toast.info('File removed')
  }

  async function onSubmit(values: FormValues) {
    try {
      if (!selectedFiles.length) {
        toast.error('Please select at least one document.')
        return
      }

      setIsUploading(true)
      const uploadedDocs: { url: string; fileId: string }[] = []

      // Sequential uploads with UI state updates
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setFileStatuses((prev) => ({ ...prev, [file.name]: 'uploading' }))

        try {
          const result = await uploadToImageKit(file)
          uploadedDocs.push(result)
          setFileStatuses((prev) => ({ ...prev, [file.name]: 'success' }))
        } catch (uploadErr) {
          setFileStatuses((prev) => ({ ...prev, [file.name]: 'error' }))
          toast.error(`Failed to upload ${file.name}`)
          throw new Error(`Upload failed for ${file.name}`)
        }
      }

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
      setSelectedFiles([])
      setFileStatuses({})
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

          <div className='space-y-4'>
            <label className='block text-sm font-medium text-gray-700'>
              Upload Documents <span className='text-red-500'>*</span>
            </label>

            <label
              htmlFor='file-upload'
              className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition'
            >
              <UploadCloud className='w-8 h-8 text-gray-400 mb-2' />
              <p className='text-sm text-gray-600'>
                <span className='font-medium text-blue-600'>
                  Click to upload
                </span>{' '}
                or drag and drop
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                PDF, JPG, PNG up to 10MB
              </p>
            </label>

            <input
              id='file-upload'
              type='file'
              multiple
              accept='image/*,application/pdf'
              onChange={handleFileChange}
              className='hidden'
              disabled={isUploading}
            />

            {selectedFiles.length > 0 && (
              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-700'>
                  Selected files ({selectedFiles.length}):
                </p>
                <ul className='space-y-2'>
                  {selectedFiles.map((file, index) => {
                    const status = fileStatuses[file.name] || 'waiting'
                    return (
                      <li
                        key={`${file.name}-${index}`}
                        className='flex flex-col p-3 bg-gray-50 border border-gray-200 rounded-lg'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3 flex-1 min-w-0'>
                            {status === 'uploading' && (
                              <Loader2 className='w-5 h-5 animate-spin text-blue-500' />
                            )}
                            {status === 'success' && (
                              <CheckCircle2 className='w-5 h-5 text-green-500' />
                            )}
                            {status === 'error' && (
                              <XCircle className='w-5 h-5 text-red-500' />
                            )}
                            {status === 'waiting' && (
                              <FileText className='w-5 h-5 text-gray-400' />
                            )}
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-gray-900 truncate'>
                                {file.name}
                              </p>
                              <p className='text-xs text-gray-500'>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          {!isUploading && (
                            <button
                              type='button'
                              onClick={() => removeFile(index)}
                              className='ml-3 text-red-500 hover:text-red-700 transition'
                            >
                              <Trash2 className='w-5 h-5' />
                            </button>
                          )}
                        </div>
                        {status === 'uploading' && (
                          <div className='w-full bg-gray-200 h-1 mt-3 rounded-full overflow-hidden'>
                            <div
                              className='bg-blue-600 h-full animate-pulse'
                              style={{ width: '100%' }}
                            />
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>

          <Button
            type='submit'
            disabled={isUploading || selectedFiles.length === 0}
            className='w-full text-lg'
          >
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Uploading Files...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </Form>

      <section className='max-w-4xl mx-auto mt-12 mb-12 px-6 py-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          Banking Details
        </h2>
        <p className='text-gray-700 mb-6'>
          A fee of <span className='font-semibold'>R150</span> must be paid and
          proof of payment can be emailed to{' '}
          <a
            href='mailto:admin@sozim.co.za'
            className='text-blue-600 font-medium underline'
          >
            admin@sozim.co.za
          </a>
          .
        </p>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700'>
          <div>
            <p className='font-medium text-gray-900'>Bank Name</p>
            <p>First National Bank</p>
          </div>
          <div>
            <p className='font-medium text-gray-900'>Account Name</p>
            <p>Sozim Trading and Consultancy CC</p>
          </div>
          <div>
            <p className='font-medium text-gray-900'>Account Number</p>
            <p>62814066610</p>
          </div>
          <div>
            <p className='font-medium text-gray-900'>Branch Code</p>
            <p>250-655</p>
          </div>
          <div>
            <p className='font-medium text-gray-900'>Account Type</p>
            <p>Cheque</p>
          </div>
          <div>
            <p className='font-medium text-gray-900'>Reference</p>
            <p>Applicant ID / ID Number</p>
          </div>
        </div>
      </section>
    </>
  )
}
