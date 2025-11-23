'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-toastify'
import { upload } from '@imagekit/next'
import { v4 as uuidv4 } from 'uuid'
import { X, FileIcon, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// --- Schema ---
const applicationSchema = z.object({
  applicantId: z.string().min(1, 'Applicant ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  status: z.string().min(1, 'Status is required'),
  documents: z.array(
    z.object({
      url: z.url(),
      fileId: z.string().min(1, 'File ID is required'),
    })
  ),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'USER' | 'ADMIN' | string
}

interface Course {
  _id: string
  name: string
}

export default function EditApplication() {
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [newFiles, setNewFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { id } = useParams()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantId: '',
      courseId: '',
      status: '',
      documents: [],
    },
  })

  const currentDocuments = watch('documents')

  // --- Fetch Data ---
  useEffect(() => {
    const init = async () => {
      try {
        const [courseRes, userRes, appRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/users'),
          fetch(`/api/applications/${id}`),
        ])

        // Courses
        if (courseRes.ok) {
          const courseData = await courseRes.json()
          setCourses(
            Array.isArray(courseData) ? courseData : courseData.data || []
          )
        }

        // Users (only role USER)
        if (userRes.ok) {
          const userData = await userRes.json()
          let loadedUsers: User[] = []

          if (Array.isArray(userData)) loadedUsers = userData
          else if (Array.isArray(userData.users)) loadedUsers = userData.users
          else if (Array.isArray(userData.data)) loadedUsers = userData.data

          const filteredUsers = loadedUsers.filter((u) => u.role === 'USER')
          setUsers(filteredUsers)
        }

        // Application Data
        if (appRes.ok) {
          const appData = await appRes.json()

          const applicantIdVal =
            typeof appData.applicantId === 'object'
              ? appData.applicantId?._id
              : appData.applicantId

          const courseIdVal =
            typeof appData.courseId === 'object'
              ? appData.courseId?._id
              : appData.courseId

          reset({
            applicantId: applicantIdVal || '',
            courseId: courseIdVal || '',
            status: appData.status,
            documents: appData.documents || [],
          })
        } else {
          toast.error('Application not found')
        }
      } catch (error: unknown) {
        console.error(error)
        toast.error('Failed to load data')
      } finally {
        setIsLoadingData(false)
      }
    }

    if (id) init()
  }, [id, reset])

  // --- File Helpers ---
  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  const handleRemoveExistingDoc = (indexToRemove: number) => {
    const updatedDocs = currentDocuments.filter(
      (_, idx) => idx !== indexToRemove
    )
    setValue('documents', updatedDocs, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0)
      setNewFiles(Array.from(e.target.files))
    else setNewFiles(null)
  }

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setIsUploading(true)

      const finalDocuments = [...data.documents]

      if (newFiles && newFiles.length > 0) {
        for (const file of newFiles) {
          const { token, signature, publicKey, expire } = await getAuthParams()
          const uniqueFileName = `${uuidv4()}_${file.name}`

          try {
            const res = await upload({
              file,
              fileName: uniqueFileName,
              folder: 'application',
              expire,
              token,
              signature,
              publicKey,
            })

            if (res?.url && res?.fileId)
              finalDocuments.push({ url: res.url, fileId: res.fileId })
          } catch (err) {
            console.error(err)
            toast.error(`Failed to upload ${file.name}`)
          }
        }
      }

      const payload = { ...data, documents: finalDocuments }

      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Application updated!')
        router.push('/dashboard/admin/applications')
        router.refresh()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Update failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoadingData)
    return (
      <div className="p-8 flex items-center gap-2">
        <Loader2 className="animate-spin" /> Loading...
      </div>
    )

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Application</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 py-12 rounded-xl space-y-6"
      >
        {/* Applicant */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Applicant</label>
          <Controller
            control={control}
            name="applicantId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Applicant" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Course */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Course</label>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Documents */}
        <div className="space-y-3 border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold text-gray-700">Documents</h3>

          {/* Existing */}
          {currentDocuments.length > 0 && (
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-500 uppercase font-bold">
                Current Files
              </p>
              {currentDocuments.map((doc, index) => (
                <div
                  key={doc.fileId || index}
                  className="flex items-center justify-between bg-white p-2 border rounded text-sm"
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline truncate max-w-[250px]"
                  >
                    <FileIcon size={16} /> View Document {index + 1}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingDoc(index)}
                    className="text-red-500 hover:bg-red-100 p-1 rounded"
                    title="Remove this file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload New */}
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">
              Add New Files
            </p>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleNewFileChange}
              className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
            />
            {newFiles && (
              <p className="text-xs text-green-600 mt-1">
                {newFiles.length} new file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading || isSubmitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading
              ? 'Uploading & Saving...'
              : isSubmitting
              ? 'Saving...'
              : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
