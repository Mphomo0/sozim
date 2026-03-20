'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { upload } from '@imagekit/next'
import { v4 as uuidv4 } from 'uuid'
import { Loader2, FileIcon, Trash2 } from 'lucide-react'
import { formSchema, FormValues } from '@/lib/schema'
import CoPrincipalDebtorSection from '@/components/sections/application-form/CoPrincipalDebtorForm'
import NewProgrammeDetailsSection from '@/components/sections/application-form/NewProgrammeDetailsSection'
import ProgrammeDetails from '@/components/sections/application-form/ProgrammeDetails'
import StudyMaterial from '@/components/sections/application-form/StudyMaterial'
import DemographicsSection from '@/components/sections/application-form/DemographicsSection'
import SpecialNeedsSection from '@/components/sections/application-form/SpecialNeedsSection'
import StudentInformationSection from '@/components/sections/application-form/StudentInformationSection'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  alternativeNumber?: string
  idNumber: string
  address: string
  nationality: string
  dob: string
  clerkId?: string
}

type UserData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  alternativeNumber: string
  idNumber: string
  address: string
  nationality: string
  dob: string | null
  clerkId: string
  _id: string
}

type EditFormValues = Omit<FormValues, 'user'> & {
  user?: UserData
}

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { updateUserInClerk } from '@/app/actions/user.actions'

export default function EditApplication() {
  const [isUploading, setIsUploading] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])

  const { id } = useParams()
  const router = useRouter()

  const appId = typeof id === 'string' ? (id as Id<'applications'>) : undefined
  console.log('[EditApplication] URL params:', { id })
  console.log('[EditApplication] appId parsed:', appId)
  const appData = useQuery(api.applications.getApplicationById, appId ? { id: appId } : 'skip')
  console.log('[EditApplication] appData from query:', appData)

  const applicantIdRaw = appData?.actualApplicantId || appData?.applicantId
  console.log('[EditApplication] applicantIdRaw:', applicantIdRaw)
  const applicantIdStr = typeof applicantIdRaw === 'string' ? applicantIdRaw : undefined
  console.log('[EditApplication] applicantIdStr:', applicantIdStr)
  
  const updateApplication = useMutation(api.applications.updateApplication)
  const updateUser = useMutation(api.users.updateUser)

  const applicantIdForUserFallback = (() => {
    if (!appData) return null
    return appData.actualApplicantId || appData.applicantId || null
  })()

  const shouldFetchFallback = appData && !appData.user && !!applicantIdForUserFallback
  const fallbackUser = useQuery(
    api.users.getUserByAnyId,
    shouldFetchFallback ? { id: applicantIdForUserFallback as string } : 'skip'
  ) as (UserData | null | undefined)

  console.log('[EditApplication] Fallback user query:', fallbackUser)
  console.log('[EditApplication] using fallback?', shouldFetchFallback)

  const initialValues = useMemo(() => {
    if (!appData) return undefined

    console.log('[EditApplication] Application raw data:', JSON.stringify(appData, null, 2))
    console.log('[EditApplication] Application data keys:', Object.keys(appData))
    console.log('[EditApplication] User object from API:', appData.user)
    const formData = JSON.parse(JSON.stringify(appData))
    
    // 1. Process Date of Birth - Ensure YYYY-MM-DD for date input
    let dobValue: string | null = null
    const rawDob = formData.user?.dob || formData.dob || formData.dateOfBirth || formData.birthDate
    if (rawDob) {
      try {
        // Handle various date formats
        let dateObj: Date | null = null
        if (typeof rawDob === 'string') {
          // Try ISO format first
          const isoDate = new Date(rawDob)
          if (!isNaN(isoDate.getTime())) {
            dateObj = isoDate
          } else {
            // Try other formats (YYYYMMDD, etc.)
            const parsed = Date.parse(rawDob)
            if (!isNaN(parsed)) {
              dateObj = new Date(parsed)
            }
          }
        } else if (typeof rawDob === 'number') {
          // Handle timestamp
          dateObj = new Date(rawDob)
        }

        if (dateObj && !isNaN(dateObj.getTime())) {
          dobValue = dateObj.toISOString().split('T')[0]
        } else {
          console.warn('[EditApplication] Invalid date format for DOB:', rawDob)
        }
      } catch (e) {
        console.error("Error parsing DOB:", e, 'Raw DOB:', rawDob)
        // Keep dobValue as null for invalid dates
      }
    }

    // 2. Build Student User Object with exhaustive fallbacks
    let userObj: UserData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      alternativeNumber: '',
      idNumber: '',
      address: '',
      nationality: '',
      dob: dobValue || null,
      clerkId: '',
      _id: '',
    }

    // First, try to get user from existing data
    if (formData.user) {
      userObj = {
        firstName: formData.user.firstName || '',
        lastName: formData.user.lastName || '',
        email: formData.user.email || '',
        phone: formData.user.phone || '',
        alternativeNumber: formData.user.alternativeNumber || '',
        idNumber: formData.user.idNumber || '',
        address: formData.user.address || '',
        nationality: formData.user.nationality || '',
        dob: dobValue,
        clerkId: formData.user.clerkId || '',
        _id: formData.user._id || '',
      }
    } else if (fallbackUser) {
      // Use fallback user data if available
      const fallbackDob = typeof fallbackUser.dob === 'number' 
        ? new Date(fallbackUser.dob).toISOString().split('T')[0]
        : fallbackUser.dob
      userObj = {
        firstName: fallbackUser.firstName || '',
        lastName: fallbackUser.lastName || '',
        email: fallbackUser.email || '',
        phone: fallbackUser.phone || '',
        alternativeNumber: fallbackUser.alternativeNumber || '',
        idNumber: fallbackUser.idNumber || '',
        address: fallbackUser.address || '',
        nationality: fallbackUser.nationality || '',
        dob: fallbackDob || dobValue,
        clerkId: fallbackUser.clerkId || '',
        _id: fallbackUser._id || '',
      }
    } else if (formData.applicantId || formData.actualApplicantId) {
      // If no user data, try to fetch user based on applicantId
      const applicantId = formData.applicantId || formData.actualApplicantId

      // Try different lookup strategies
      const userId = typeof applicantId === 'string' ? applicantId : ''

      // Try to fetch user data using multiple methods
      if (userId) {
        // Try by _id first
        userObj = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          alternativeNumber: '',
          idNumber: '',
          address: '',
          nationality: '',
          dob: dobValue,
          clerkId: '',
          _id: '',
        }
      }
    }

    // Fallback to top-level fields if user object is still empty
    if (Object.keys(userObj).length === 0 || !userObj.firstName) {
      userObj = {
        firstName: formData.firstName || formData?.user?.firstName || '',
        lastName: formData.lastName || formData?.user?.lastName || '',
        email: formData.email || formData?.user?.email || '',
        phone: formData.phone || formData.phoneNumber || formData.cellphone || formData.cellNumber || formData?.user?.phone || '',
        alternativeNumber: formData.alternativeNumber || formData.altPhone || formData?.user?.alternativeNumber || '',
        idNumber: formData.idNumber || formData.idNo || formData.identityNumber || formData?.user?.idNumber || '',
        address: formData.address || formData.homeAddress || formData.residentialAddress || formData.residentalAddress || formData?.user?.address || '',
        nationality: formData.nationality || formData?.user?.nationality || '',
        dob: dobValue,
        clerkId: formData.clerkId || formData?.user?.clerkId || '',
        _id: formData._id || formData?.user?._id || '',
      }
    }

    // Enhanced validation - ensure required fields are present
    const hasCriticalFields = userObj.firstName && userObj.lastName && userObj.idNumber && userObj.email
    if (!hasCriticalFields) {
      console.warn('[EditApplication] Missing critical user fields - falling back:', {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        idNumber: userObj.idNumber,
        email: userObj.email
      })

      // Try to populate from alternative sources
      if (!userObj.firstName) userObj.firstName = formData?.user?.firstName || formData.firstName || ''
      if (!userObj.lastName) userObj.lastName = formData?.user?.lastName || formData.lastName || ''
      if (!userObj.idNumber) userObj.idNumber = formData?.user?.idNumber || formData.idNumber || ''
      if (!userObj.email) userObj.email = formData?.user?.email || formData.email || ''
    }

    // Final validation - provide defaults only if absolutely necessary
    if (!userObj.firstName || !userObj.lastName || !userObj.idNumber || !userObj.email) {
      console.warn('[EditApplication] Using fallback defaults for missing critical fields:', {
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        idNumber: userObj.idNumber,
        email: userObj.email
      })

      // Provide defaults for critical fields
      userObj.firstName = userObj.firstName || 'Unknown'
      userObj.lastName = userObj.lastName || 'User'
      userObj.idNumber = userObj.idNumber || '0000000000000'
      userObj.email = userObj.email || 'unknown@example.com'
    }

    // 3. Process application data
    const { user: _u, ...restData } = formData

    // Handle courseId
    let courseIdValue = ''
    if (formData.actualCourseId) {
      courseIdValue = formData.actualCourseId.toString()
    } else if (formData.courseId) {
      courseIdValue = typeof formData.courseId === 'object'
        ? formData.courseId?._id || formData.courseId?.toString() || formData.courseId
        : formData.courseId
    }

    // Enhanced validation - ensure required fields are present
    if (!courseIdValue && formData.courseId) {
      console.warn('[EditApplication] Course ID resolution issue:', {
        actualCourseId: formData.actualCourseId,
        courseId: formData.courseId
      })
    }

    // 4. Map Race value - check both selectYourRace and race from formData
    const raceValue = formData.selectYourRace || formData.race || ''
    const normalizedRace = raceValue.toLowerCase().trim() === 'indian/asian' || 
                           raceValue.toLowerCase().trim() === 'indian asian' 
                           ? 'indian-asian' 
                           : raceValue.toLowerCase().trim()

    // 5. Map provinceDelivery to proper format if needed (slug -> full name)
    let provinceDeliveryValue = formData.provinceDelivery || ''
    const provinceMap: Record<string, string> = {
      'eastern-cape': 'Eastern Cape',
      'free-state': 'Free State',
      'gauteng': 'Gauteng',
      'kwazulu-natal': 'KwaZulu-Natal',
      'limpopo': 'Limpopo',
      'mpumalanga': 'Mpumalanga',
      'northern-cape': 'Northern Cape',
      'north-west': 'North West',
      'western-cape': 'Western Cape',
    }
    if (provinceDeliveryValue && provinceMap[provinceDeliveryValue.toLowerCase()]) {
      provinceDeliveryValue = provinceMap[provinceDeliveryValue.toLowerCase()]
    }

    const finalValues = {
      ...restData,
      courseId: courseIdValue,
      applicantId: applicantIdStr || '',
      status: formData.status || restData.status || 'PENDING',
      selectYourRace: raceValue,
      race: normalizedRace,
      provinceDelivery: provinceDeliveryValue,
      user: userObj,
      documents: formData.documents || [],
      qualifications: formData.qualifications || [],
      disabilities: formData.disabilities || {},
    }
    console.log('[EditApplication] Final initial values:', JSON.stringify(finalValues, null, 2))
    console.log('[EditApplication] User object in final values:', finalValues.user)
    console.log('[EditApplication] User fields populated:', {
      firstName: finalValues.user.firstName,
      lastName: finalValues.user.lastName,
      email: finalValues.user.email,
      phone: finalValues.user.phone,
      idNumber: finalValues.user.idNumber
    })
    return finalValues
  }, [appData, applicantIdStr, fallbackUser])

  const form = useForm<EditFormValues>({
    resolver: zodResolver(
      formSchema.partial({ user: true }).extend({
        documents: z.array(z.object({
          url: z.string(),
          fileId: z.string().min(1, 'File ID is required'),
        })).optional().default([]),
        user: z.object({
          firstName: z.string().optional().default(''),
          lastName: z.string().optional().default(''),
          email: z.string().optional().default(''),
          phone: z.string().optional().default(''),
          alternativeNumber: z.string().optional().default(''),
          idNumber: z.string().optional().default(''),
          address: z.string().optional().default(''),
          nationality: z.string().optional().default(''),
          dob: z.any().nullable().optional().default(null),
          clerkId: z.string().optional().default(''),
          _id: z.string().optional().default(''),
        }).partial().optional()
      })
    ) as any,
    defaultValues: {
      applicantId: '',
      courseId: '',
      status: 'PENDING',
      documents: [],
      qualifications: [],
      disabilities: {},
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        alternativeNumber: '',
        idNumber: '',
        address: '',
        nationality: '',
        dob: null,
      },
    },
  })

  // EXPLICIT RESET when data is loaded
  useEffect(() => {
    if (initialValues) {
      console.log('[EditApplication] Resetting form with initialValues:', initialValues)
      form.reset(initialValues)
      console.log('[EditApplication] Form after reset - user field:', form.getValues('user'))
      console.log('[EditApplication] Form after reset - firstName:', form.getValues('user.firstName'))
      console.log('[EditApplication] Form after reset - email:', form.getValues('user.email'))
      console.log('[EditApplication] Form after reset - idNumber:', form.getValues('user.idNumber'))
    }
  }, [initialValues, form])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'qualifications',
  })

  const watchSpecialNeeds = form.watch('specialNeeds')

  const disabilityPath = (key: keyof NonNullable<FormValues['disabilities']>) =>
    `disabilities.${key}` as const

  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to get upload auth')
    return await res.json()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files))
    }
  }

  const removeExistingDocument = (index: number) => {
    const current = form.getValues('documents')
    form.setValue(
      'documents',
      current.filter((_, i) => i !== index)
    )
  }

  const onSubmit = async (data: EditFormValues) => {
    if (!appId) return

    try {
      setIsUploading(true)

      let finalDocuments = [...(data.documents || [])]

      if (newFiles.length > 0) {
        const { token, signature, publicKey, expire } = await getAuthParams()

        for (const file of newFiles) {
          const uniqueFileName = `${uuidv4()}_${file.name}`

          const uploadRes = await upload({
            file,
            fileName: uniqueFileName,
            folder: 'applications',
            token,
            signature,
            expire,
            publicKey,
          })

          if (uploadRes?.url && uploadRes?.fileId) {
            finalDocuments.push({
              url: uploadRes.url,
              fileId: uploadRes.fileId,
            })
          } else {
            toast.error(`Failed to upload ${file.name}`)
          }
        }
      }

      const { user: userData, courseId: _, documents: __, ...applicationData } = data

      // 1. Update User and sync to Clerk if they exist
      const userToUpdate = (appData as any)?.user
      if (userData && userToUpdate?._id) {
         await updateUser({
           id: userToUpdate._id,
           firstName: userData.firstName || null,
           lastName: userData.lastName || null,
           email: userData.email || null,
           phone: userData.phone || null,
           idNumber: userData.idNumber || null,
           address: userData.address || null,
           nationality: userData.nationality || null,
           alternativeNumber: userData.alternativeNumber || null,
            dob: userData.dob || null,
         })

         if (userToUpdate.clerkId) {
           let clerkPhone = userData.phone
           if (clerkPhone) {
             clerkPhone = clerkPhone.replace(/\s+/g, '')
             if (!clerkPhone.startsWith('+')) {
               if (clerkPhone.startsWith('0') && clerkPhone.length === 10) {
                 clerkPhone = '+27' + clerkPhone.substring(1)
               } else {
                 clerkPhone = '+' + clerkPhone
               }
             }
           }

           await updateUserInClerk(userToUpdate.clerkId, {
             firstName: userData.firstName || undefined,
             lastName: userData.lastName || undefined,
             phone: clerkPhone || undefined,
           })
         }
      }

      // 2. Update application via Convex
      await updateApplication({
        id: appId,
        status: data.status,
        data: {
          ...applicationData,
          courseId: data.courseId,
          documents: finalDocuments,
        }
      })

      toast.success('Application updated successfully!')
      router.push('/dashboard/admin/applications')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  if (appData === undefined) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="text-lg">Loading application...</span>
      </div>
    )
  }

  // Check for missing critical user data
  const hasCriticalUserData = appData?.user || fallbackUser
  const missingUserData = !hasCriticalUserData && appData && appData.applicantId

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        {missingUserData && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Data Issue Detected
            </h3>
            <p className="text-sm text-yellow-900">
              Application data is present but user information is missing or incomplete.
              This may cause form fields to appear empty.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Applicant ID: {appData?.applicantId || appData?.actualApplicantId || 'Unknown'}
            </p>
          </div>
        )}
        {((appData as any)?.user || fallbackUser) && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Linked Account Info
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium">
                  {(appData as any)?.user?.firstName || fallbackUser?.firstName || 'Loading...'}
                  {' '}
                  {(appData as any)?.user?.lastName || fallbackUser?.lastName || ''}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-medium">
                  {(appData as any)?.user?.email || fallbackUser?.email || 'Loading...'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Clerk ID:</span>{' '}
                <span className="font-mono text-xs">
                  {(appData as any)?.user?.clerkId || fallbackUser?.clerkId || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form 
        key={appData?._id?.toString() || 'loading'} 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-12"
      >
        <CoPrincipalDebtorSection form={form as any} />
        <NewProgrammeDetailsSection form={form as any} isAdmin={true} />
        <ProgrammeDetails
          form={form as any}
          fields={fields}
          append={append as any}
          remove={remove as any}
        />
        <StudyMaterial form={form as any} />
        <DemographicsSection form={form as any} />
        <StudentInformationSection form={form as any} isLoggedIn={false} />
        <SpecialNeedsSection
          form={form as any}
          watchSpecialNeeds={watchSpecialNeeds}
          disabilityPath={disabilityPath}
        />

        <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
          <h2 className="font-bold text-3xl text-primary border-b pb-2">
            Supporting Documents
          </h2>

          {(form.watch('documents') || []).length > 0 && (
            <div className="space-y-3">
              <p className="font-semibold text-gray-700">Current Documents</p>
              {(form.watch('documents') || []).map((doc, index) => (
                <div
                  key={doc.fileId || index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg border"
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-blue-600 hover:underline"
                  >
                    <FileIcon size={20} />
                    <span className="truncate max-w-md">
                      Document {index + 1}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => removeExistingDocument(index)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <label className="font-semibold text-gray-700">
              Add New Documents
            </label>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0
                file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {newFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-green-700">
                  {newFiles.length} file(s) ready to upload:
                </p>
                {newFiles.map((file, i) => (
                  <div key={i} className="text-sm text-gray-600 pl-4">
                    • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t">
          <button
            type="button"
            onClick={() => router.push('/dashboard/admin/applications')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || form.formState.isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading || form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
