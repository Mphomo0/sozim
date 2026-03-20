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

type EditFormValues = Omit<FormValues, 'user'> & {
  user?: FormValues['user']
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
  const appData = useQuery(api.applications.getApplicationById, appId ? { id: appId } : 'skip')
  
  const applicantIdRaw = appData?.actualApplicantId || appData?.applicantId
  const applicantIdStr = typeof applicantIdRaw === 'string' ? applicantIdRaw : undefined
  
  const updateApplication = useMutation(api.applications.updateApplication)
  const updateUser = useMutation(api.users.updateUser)

  const initialValues = useMemo(() => {
    if (!appData) return undefined

    const formData = JSON.parse(JSON.stringify(appData))
    
    // 1. Process Date of Birth - Ensure YYYY-MM-DD for date input
    let dobValue: any = null
    const rawDob = formData.user?.dob || formData.dob || formData.dateOfBirth || formData.birthDate
    if (rawDob) {
      try {
        const d = new Date(rawDob)
        if (!isNaN(d.getTime())) {
          dobValue = d.toISOString().split('T')[0]
        }
      } catch (e) {
        console.error("Error parsing DOB:", e)
      }
    }

    // 2. Build Student User Object with exhaustive fallbacks
    const userObj = {
      firstName: formData.user?.firstName || formData.firstName || '',
      lastName: formData.user?.lastName || formData.lastName || '',
      email: formData.user?.email || formData.email || '',
      phone: formData.user?.phone || formData.phone || formData.phoneNumber || formData.cellphone || formData.cellNumber || '',
      alternativeNumber: formData.user?.alternativeNumber || formData.alternativeNumber || formData.altPhone || '',
      idNumber: formData.user?.idNumber || formData.idNumber || formData.idNo || formData.identityNumber || '',
      address: formData.user?.address || formData.address || formData.homeAddress || formData.residentialAddress || formData.residentalAddress || '',
      nationality: formData.user?.nationality || formData.nationality || '',
      dob: dobValue,
    }

    // 3. Process application data
    const { user: _u, ...restData } = formData

    // Handle courseId
    let courseIdValue = ''
    if (formData.actualCourseId) {
      courseIdValue = formData.actualCourseId.toString()
    } else if (formData.courseId) {
      courseIdValue = typeof formData.courseId === 'object' 
        ? formData.courseId?._id || formData.courseId 
        : formData.courseId
    }

    // 4. Map Race value correctly for Select components
    if (restData.selectYourRace) {
      const raceValue = String(restData.selectYourRace).toLowerCase().trim()
      if (raceValue === 'indian/asian' || raceValue === 'indian asian' || raceValue === 'indian-asian') {
        restData.selectYourRace = 'indian-asian'
      } else {
        restData.selectYourRace = raceValue
      }
    }

    return {
      ...restData,
      courseId: courseIdValue,
      applicantId: applicantIdStr || '',
      race: formData.selectYourRace || restData.race || '',
      user: userObj,
      documents: formData.documents || [],
      qualifications: formData.qualifications || [],
      disabilities: formData.disabilities || {},
    }
  }, [appData, applicantIdStr])

  const form = useForm<EditFormValues>({
    resolver: zodResolver(
      formSchema.partial({ user: true }).extend({
        documents: z.array(z.object({
          url: z.string(),
          fileId: z.string().min(1, 'File ID is required'),
        })).optional().default([]),
        user: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          alternativeNumber: z.string().optional(),
          idNumber: z.string().optional(),
          address: z.string().optional(),
          nationality: z.string().optional(),
          dob: z.any().nullable(),
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
      form.reset(initialValues)
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
           dob: userData.dob instanceof Date ? userData.dob.toISOString() : (userData.dob || null),
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

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        {(appData as any)?.user && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Linked Account Info
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium">
                  {(appData as any).user.firstName} {(appData as any).user.lastName}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-medium">{(appData as any).user.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Clerk ID:</span>{' '}
                <span className="font-mono text-xs">{(appData as any).user.clerkId || 'N/A'}</span>
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
