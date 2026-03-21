'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUser } from '@clerk/nextjs'
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
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

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

type Props = {
  onSuccess?: () => void
}

export default function CreateApplication({ onSuccess }: Props) {
  const { user, isLoaded } = useUser()
  const hasPrefilledRef = useRef(false)

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
        dob: null,
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
    if (!isLoaded || !user || hasPrefilledRef.current) return
    hasPrefilledRef.current = true

    form.setValue('user.firstName', user.firstName ?? '')
    form.setValue('user.lastName', user.lastName ?? '')
    form.setValue('user.email', user.primaryEmailAddress?.emailAddress ?? '')
    form.setValue('user.phone', (user.publicMetadata?.phone as string) ?? '')
    form.setValue('user.idNumber', (user.publicMetadata?.idNumber as string) ?? '')
    form.setValue('user.address', (user.publicMetadata?.address as string) ?? '')
    form.setValue('user.nationality', (user.publicMetadata?.nationality as string) ?? '')
    form.setValue('user.alternativeNumber', (user.publicMetadata?.alternativeNumber as string) ?? '')
    form.setValue('user.dob', null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded])

  const getAuthParams = async () => {
    try {
      const res = await fetch('/api/images/upload-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const message = errorData?.message || errorData?.error || `Upload auth failed (${res.status})`
        throw new Error(message)
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

    const result = await response.json()
    return {
      url: result.url,
      fileId: result.fileId,
    }
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

  const createApplication = useMutation(api.applications.createApplication)
  const updateUser = useMutation(api.users.updateUser)
  const getUserByClerkId = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  )
  const allCourses = useQuery(api.courses.getCourses) || []
  const courseIdValue = form.watch('courseId')
  const selectedCourse = allCourses.find((c) => c._id === courseIdValue)
  const isCourseClosed = selectedCourse && !selectedCourse.isOpen
  const checkExistingApplication = useQuery(
    api.applications.checkExistingApplication,
    getUserByClerkId && courseIdValue
      ? { applicantId: getUserByClerkId._id, courseId: courseIdValue }
      : 'skip'
  )

  async function onSubmit(values: FormValues) {
    try {
      if (!selectedFiles.length) {
        toast.error('Please select at least one document.')
        return
      }

      if (isCourseClosed) {
        toast.error('Applications for this programme are currently closed.')
        return
      }

      if (!user?.id) {
        toast.error('You must be logged in to submit an application.')
        return
      }

      // Resolve convex user from Clerk ID
      if (!getUserByClerkId) {
        toast.error(
          'Your profile is not set up yet. Please click your user icon in the top-right corner to update your profile before applying.'
        )
        return
      }

      const convexUserId = getUserByClerkId._id

      const courseId = values.courseId
      if (!courseId) {
        toast.error('Please select a programme/course.')
        return
      }

      // Check for existing application before uploading files
      if (checkExistingApplication) {
        toast.error('You have already applied for this course. You cannot apply for the same course twice.')
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

      await createApplication({
        applicantId: convexUserId,
        clerkId: user?.id || '',
        courseId: courseId,
        documents: uploadedDocs,
        data: {
          fullNameCompany: values.fullNameCompany,
          sponsor: values.sponsor,
          companyReg: values.companyReg,
          sponsorEmail: values.sponsorEmail,
          homeAddress: values.homeAddress,
          phoneNumber: values.phoneNumber,
          alternativeNumber: values.alternativeNumber,
          genderDebtor: values.genderDebtor,
          selectYourRace: values.selectYourRace,
          nationality: values.nationality,
          employmentStatus: values.employmentStatus,
          employerName: values.employerName,
          employmentSector: values.employmentSector,
          employerAddress: values.employerAddress,
          maritalStatus: values.maritalStatus,
          deliveryAddress: values.deliveryAddress,
          provinceDelivery: values.provinceDelivery,
          postalCodeDelivery: values.postalCodeDelivery,
          deliveryMethod: values.deliveryMethod,
          highestGradeAchieved: values.highestGradeAchieved,
          highestGradeOther: values.highestGradeOther,
          yearCompleted: values.yearCompleted,
          schoolAttended: values.schoolAttended,
          schoolProvince: values.schoolProvince,
          qualifications: values.qualifications,
          qualificationType: values.qualificationType,
          socioEconomicStatus: values.socioEconomicStatus,
          homeLanguage: values.homeLanguage,
          homeLanguageOther: values.homeLanguageOther,
          gender: values.gender,
          race: values.race,
          raceOther: values.raceOther,
          specialNeeds: values.specialNeeds,
          disabilities: values.disabilities,
          examRequirements: values.examRequirements,
          status: 'PENDING',
        },
      })

      // Update user record with idNumber and dob if provided
      if (values.user.idNumber || values.user.dob) {
        const userUpdateData: any = {}
        if (values.user.idNumber) userUpdateData.idNumber = values.user.idNumber
        if (values.user.dob) userUpdateData.dob = values.user.dob
        
        await updateUser({
          id: convexUserId,
          ...userUpdateData,
        })
      }

      toast.success('Application submitted successfully')
      form.reset()
      setSelectedFiles([])
      setFileStatuses({})
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed'
      toast.error(message)
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

          {checkExistingApplication && (
            <div className='p-4 bg-amber-50 border border-amber-200 rounded-lg'>
              <p className='text-amber-800 font-medium'>
                You have already applied for this course. You cannot apply for the same course twice.
              </p>
            </div>
          )}

          <NewProgrammeDetailsSection form={form} />
          <DemographicsSection form={form} />

          <SpecialNeedsSection
            form={form}
            watchSpecialNeeds={watchSpecialNeeds}
            disabilityPath={disabilityPath}
          />

          <StudentInformationSection
            form={form}
            isLoggedIn={isLoaded && !!user}
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
            disabled={isUploading || selectedFiles.length === 0 || checkExistingApplication || isCourseClosed}
            className='w-full text-lg'
          >
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Uploading Files...
              </>
            ) : checkExistingApplication ? (
              'Already Applied'
            ) : isCourseClosed ? (
              'Applications Closed'
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
