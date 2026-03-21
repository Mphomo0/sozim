'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
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

  // Debug: Check what fields are actually present in appData
  useEffect(() => {
    if (appData) {
      console.log('[EditApplication] Available fields in appData:', Object.keys(appData))
      console.log('[EditApplication] Specific delivery fields:', {
        deliveryAddress: appData.deliveryAddress,
        provinceDelivery: appData.provinceDelivery,
        postalCodeDelivery: appData.postalCodeDelivery,
        deliveryMethod: appData.deliveryMethod
      })
    }
  }, [appData])

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

    const formData = JSON.parse(JSON.stringify(appData))
    
    // Helper to normalize strings to match enum slugs
    const normalizeEnum = (val: any) => {
      if (typeof val !== 'string' || !val) return val
      
      const normalized = val.toLowerCase().trim()
        .replace(/[^a-z0-9\s/-]/g, '') // Remove special chars but keep spaces, hyphens, slashes
        .replace(/[\s/]+/g, '-')       // Replace spaces and slashes with hyphens
      
      // Specific legacy mappings
      const mapping: Record<string, string> = {
        'african': 'african',
        'coloured': 'coloured',
        'indian-asian': 'indian-asian',
        'indian/asian': 'indian-asian',
        'indian-and-asian': 'indian-asian',
        'white': 'white',
        'other': 'other',
        'male': 'male',
        'female': 'female',
        'not-disclose': 'not-disclose',
        'not-to-disclose': 'not-disclose',
        'do-not-wish-to-disclose': 'not-disclose',
        'unemployed-seeking-work': 'unemployed-seeking',
        'unemployed-not-seeking-work': 'unemployed-not-seeking',
        'grade-12-in-progress': 'grade-12-in-progress',
        'grade-12-completed': 'grade-12-completed',
        'none': 'none',
        'yes': 'yes'
      }
      
      return mapping[normalized] || normalized
    }

    // 1. Process Date of Birth - Ensure YYYY-MM-DD for date input
    let dobValue: string | null = null
    const rawDob = formData.user?.dob || formData.dob || formData.dateOfBirth || formData.birthDate || formData.dobUser
    if (rawDob) {
      try {
        let dateObj: Date | null = null
        if (typeof rawDob === 'string') {
          const isoDate = new Date(rawDob)
          if (!isNaN(isoDate.getTime())) {
            dateObj = isoDate
          } else {
            const parsed = Date.parse(rawDob)
            if (!isNaN(parsed)) {
              dateObj = new Date(parsed)
            }
          }
        } else if (typeof rawDob === 'number') {
          dateObj = new Date(rawDob)
        }

        if (dateObj && !isNaN(dateObj.getTime())) {
          dobValue = dateObj.toISOString().split('T')[0]
        }
      } catch (e) {
        console.error("Error parsing DOB:", e, 'Raw DOB:', rawDob)
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
        dob: dobValue || formData.user.dob || null,
        clerkId: formData.user.clerkId || '',
        _id: formData.user._id || '',
      }
    } else if (fallbackUser) {
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
    }

    // Final Fallback to top-level fields for student user info
    if (!userObj.firstName) userObj.firstName = formData.firstName || ''
    if (!userObj.lastName) userObj.lastName = formData.lastName || ''
    if (!userObj.email) userObj.email = formData.email || ''
    if (!userObj.phone) userObj.phone = formData.phone || formData.phoneNumber || formData.cellphone || formData.cellNumber || ''
    if (!userObj.alternativeNumber) userObj.alternativeNumber = formData.alternativeNumber || formData.altPhone || formData.altNumber || ''
    if (!userObj.idNumber) userObj.idNumber = formData.idNumber || formData.idNo || formData.identityNumber || ''
    if (!userObj.address) userObj.address = formData.address || formData.homeAddress || formData.residentialAddress || ''
    if (!userObj.nationality) userObj.nationality = formData.nationality || ''

    // 3. Process application data
    const { user: _u, course: _c, ...restData } = formData

    // Handle courseId - must be Convex ID for the Select component
    //优先使用actualCourseId，其次使用courseId（可能是mongo id或Convex id）
    let courseIdValue = ''
    if (formData.actualCourseId) {
      courseIdValue = formData.actualCourseId.toString()
    } else if (formData.courseId) {
      // courseId可能是mongo id字符串，需要检查是否为Convex ID格式（以j开头）
      courseIdValue = typeof formData.courseId === 'object'
        ? formData.courseId?._id || formData.courseId?.toString() || formData.courseId
        : formData.courseId
    }
    
    // 如果courseId是mongo格式的字符串但actualCourseId不存在，尝试使用
    if (!courseIdValue && formData.courseId) {
      courseIdValue = formData.courseId
    }

    // Debug: Log course info
    console.log('[EditApplication] formData.course:', formData.course)
    console.log('[EditApplication] formData.courseId raw:', JSON.stringify(formData.courseId))
    console.log('[EditApplication] formData.actualCourseId:', formData.actualCourseId)
    console.log('[EditApplication] courseIdValue final:', courseIdValue)

    // 4. Normalize Enum Fields
    const raceValue = formData.race || formData.selectYourRace || ''
    const normalizedRace = normalizeEnum(raceValue)
    
    // Debug: Log race/gender values
    console.log('[EditApplication] formData.selectYourRace:', formData.selectYourRace)
    console.log('[EditApplication] formData.genderDebtor:', formData.genderDebtor)
    console.log('[EditApplication] formData.gender:', formData.gender)
    console.log('[EditApplication] raceValue:', raceValue)
    console.log('[EditApplication] normalizedRace:', normalizedRace)
    
    const deliveryMethodValue = normalizeEnum(formData.deliveryMethod)
    const highestGradeAchievedValue = normalizeEnum(formData.highestGradeAchieved)
    const qualificationTypeValue = normalizeEnum(formData.qualificationType)
    const socioEconomicStatusValue = normalizeEnum(formData.socioEconomicStatus)
    const homeLanguageValue = normalizeEnum(formData.homeLanguage)
    const genderValue = normalizeEnum(formData.gender)

    // Co-principal debtor fields - use original values, not normalized for display
    const selectYourRaceValue = formData.selectYourRace || normalizeEnum(raceValue)
    const genderDebtorValue = formData.genderDebtor || formData.gender || ''

    // 5. Map provinceDelivery to Full Name (as now expected by StudyMaterial.tsx)
    let provinceDeliveryValue = formData.provinceDelivery || ''
    
    // Debug: Log province
    console.log('[EditApplication] formData.provinceDelivery:', formData.provinceDelivery)
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
    
    const normalizedProv = provinceDeliveryValue.toLowerCase().trim().replace(/\s+/g, '-')
    if (provinceMap[normalizedProv]) {
      provinceDeliveryValue = provinceMap[normalizedProv]
    }

    const finalValues = {
      ...restData,
      courseId: courseIdValue,
      applicantId: applicantIdStr || '',
      status: formData.status || 'PENDING',

      // Map all application data fields directly
      deliveryAddress: formData.deliveryAddress || formData.deliveryAddress || '',
      postalCodeDelivery: formData.postalCodeDelivery || formData.postalCode || '',
      provinceDelivery: provinceDeliveryValue,
      deliveryMethod: deliveryMethodValue,

      // Normalized fields
      race: normalizedRace,
      selectYourRace: formData.selectYourRace || selectYourRaceValue || '',
      highestGradeAchieved: highestGradeAchievedValue,
      qualificationType: qualificationTypeValue,
      socioEconomicStatus: socioEconomicStatusValue,
      homeLanguage: homeLanguageValue,
      gender: genderValue,
      genderDebtor: formData.genderDebtor || genderDebtorValue || '',

      user: userObj,
      documents: formData.documents || [],
      qualifications: formData.qualifications || [],
      disabilities: formData.disabilities || {},

      // Additional fallback mappings for missing fields
      ...(formData.schoolAttended && { schoolAttended: formData.schoolAttended }),
      ...(formData.schoolProvince && { schoolProvince: formData.schoolProvince }),
      ...(formData.examRequirements && { examRequirements: formData.examRequirements }),
      ...(formData.maritalStatus && { maritalStatus: formData.maritalStatus }),
      ...(formData.employerName && { employerName: formData.employerName }),
      ...(formData.employmentSector && { employmentSector: formData.employmentSector }),
      ...(formData.employerAddress && { employerAddress: formData.employerAddress }),
      ...(formData.fullNameCompany && { fullNameCompany: formData.fullNameCompany }),
      ...(formData.sponsor && { sponsor: formData.sponsor }),
      ...(formData.companyReg && { companyReg: formData.companyReg }),
      ...(formData.sponsorEmail && { sponsorEmail: formData.sponsorEmail }),
      // Explicitly map co-principal debtor fields from application level
      homeAddress: formData.homeAddress || '',
      phoneNumber: formData.phoneNumber || '',
      alternativeNumber: formData.alternativeNumber || '',
      nationality: formData.nationality || '',
      employmentStatus: formData.employmentStatus || '',
    }
    
    // Debug logging
    console.log('[EditApplication] finalValues keys:', Object.keys(finalValues))
    console.log('[EditApplication] finalValues.homeAddress:', finalValues.homeAddress)
    console.log('[EditApplication] finalValues.phoneNumber:', finalValues.phoneNumber)
    console.log('[EditApplication] finalValues.selectYourRace:', finalValues.selectYourRace)
    console.log('[EditApplication] finalValues.user:', finalValues.user)
    console.log('[EditApplication] finalValues.user.phone:', finalValues.user?.phone)
    console.log('[EditApplication] finalValues.user.alternativeNumber:', finalValues.user?.alternativeNumber)
    
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

  // EXPLICIT RESET when data is loaded - only once
  const hasResetRef = useRef(false)
  useEffect(() => {
    if (initialValues && !hasResetRef.current) {
      // Check that we have actual application data (not just default structure)
      if (initialValues._id) {
        hasResetRef.current = true
        console.log('[EditApplication] Resetting form with initialValues')
        form.reset(initialValues)
        console.log('[EditApplication] Form after reset - courseId:', form.getValues('courseId'))
        console.log('[EditApplication] Form after reset - selectYourRace:', form.getValues('selectYourRace'))
        console.log('[EditApplication] Form after reset - provinceDelivery:', form.getValues('provinceDelivery'))
      }
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
        // Only update fields with actual values (non-empty strings)
        const userUpdateData: any = {}
        
        if (userData.firstName) userUpdateData.firstName = userData.firstName
        if (userData.lastName) userUpdateData.lastName = userData.lastName
        if (userData.email) userUpdateData.email = userData.email
        if (userData.phone) userUpdateData.phone = userData.phone
        if (userData.idNumber) userUpdateData.idNumber = userData.idNumber
        if (userData.address) userUpdateData.address = userData.address
        if (userData.nationality) userUpdateData.nationality = userData.nationality
        if (userData.alternativeNumber) userUpdateData.alternativeNumber = userData.alternativeNumber
        if (userData.dob) userUpdateData.dob = userData.dob
        
        // Debug: Log what we're updating
        console.log('[EditApplication] Updating user with:', userUpdateData)
        
        if (Object.keys(userUpdateData).length > 0) {
          await updateUser({
            id: userToUpdate._id,
            ...userUpdateData,
          })
        }

        if (userToUpdate.clerkId && userData.phone) {
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
      const updateData: any = {
        ...applicationData,
        courseId: data.courseId,
        documents: finalDocuments,
      }
      
      // If courseId is a Convex ID (not mongo), also set actualCourseId
      if (data.courseId && data.courseId.startsWith('j')) {
        updateData.actualCourseId = data.courseId as any
      }
      
      await updateApplication({
        id: appId,
        status: data.status,
        data: updateData
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
