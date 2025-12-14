'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
}

// Create a type for editing that makes user optional
type EditFormValues = Omit<FormValues, 'user'> & {
  user?: FormValues['user']
}

export default function EditApplication() {
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [user, setUser] = useState<User | null>(null)

  const { id } = useParams()
  const router = useRouter()

  const form = useForm<EditFormValues>({
    resolver: zodResolver(formSchema.partial({ user: true })) as any,
    defaultValues: {
      applicantId: '',
      documents: [],
      qualifications: [],
      disabilities: {},
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'qualifications',
  })

  const watchSpecialNeeds = form.watch('specialNeeds')

  const disabilityPath = (key: keyof NonNullable<FormValues['disabilities']>) =>
    `disabilities.${key}` as const

  // --- Fetch Application Data ---
  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return

      try {
        const res = await fetch(`/api/applications/${id}`)
        if (!res.ok) throw new Error('Failed to fetch application')

        const appData = await res.json()

        // Extract applicantId (could be populated object or just ID)
        const applicantId =
          typeof appData.applicantId === 'object'
            ? appData.applicantId._id
            : appData.applicantId

        // Fetch user data if applicantId exists
        if (applicantId) {
          try {
            const userRes = await fetch(`/api/users/${applicantId}`)
            if (userRes.ok) {
              const userData = await userRes.json()
              setUser(userData)
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error)
          }
        }

        // Populate form with application data only (no user fields)
        form.reset({
          ...appData,
          // Handle populated refs
          courseId:
            typeof appData.courseId === 'object'
              ? appData.courseId._id
              : appData.courseId,
          applicantId: applicantId,
        })
      } catch (error) {
        console.error(error)
        toast.error('Failed to load application')
        router.push('/dashboard/admin/applications')
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchApplication()
  }, [id, form, router])

  // --- File Upload Helpers ---
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
    try {
      setIsUploading(true)

      let finalDocuments = [...data.documents]

      // Upload new files
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

      // Remove user from data before sending (we don't update user)
      const { user: _, ...applicationData } = data

      // Update application (user is NOT updated)
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...applicationData,
          documents: finalDocuments,
        }),
      })

      if (res.ok) {
        toast.success('Application updated successfully!')
        router.push('/dashboard/admin/applications')
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to update application')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoadingData) {
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
        {/* Display user info (read-only) */}
        {user && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">
              Applicant Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>{' '}
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span>{' '}
                <span className="font-medium">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>{' '}
                <span className="font-medium">{user.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">ID Number:</span>{' '}
                <span className="font-medium">{user.idNumber}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        {/* All Form Sections - cast form to expected type */}
        <CoPrincipalDebtorSection form={form as any} />
        <NewProgrammeDetailsSection form={form as any} />
        <ProgrammeDetails
          form={form as any}
          fields={fields}
          append={append as any}
          remove={remove as any}
        />
        <StudyMaterial form={form as any} />
        <DemographicsSection form={form as any} />
        <SpecialNeedsSection
          form={form as any}
          watchSpecialNeeds={watchSpecialNeeds}
          disabilityPath={disabilityPath}
        />

        {/* Documents Section */}
        <div className="space-y-6 p-6 border rounded-xl bg-gray-50">
          <h2 className="font-bold text-3xl text-primary border-b pb-2">
            Supporting Documents
          </h2>

          {/* Existing Documents */}
          {form.watch('documents').length > 0 && (
            <div className="space-y-3">
              <p className="font-semibold text-gray-700">Current Documents</p>
              {form.watch('documents').map((doc, index) => (
                <div
                  key={doc.fileId}
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

          {/* Upload New */}
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

        {/* Submit Buttons */}
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
