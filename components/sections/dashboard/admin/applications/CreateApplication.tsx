'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-toastify'
import { upload } from '@imagekit/next'
import { v4 as uuidv4 } from 'uuid'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// --- Types & Schema ---
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

type Course = {
  _id: string
  name: string
}

type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
}

export default function CreateApplication() {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])

  const router = useRouter()

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicantId: '',
      courseId: '',
      status: '',
      documents: [],
    },
  })

  // --- Helper: Fetch Auth Params ---
  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  // --- Helper: Handle File Selection ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Convert FileList to a standard Array
      setSelectedFiles(Array.from(e.target.files))
    } else {
      setSelectedFiles(null)
    }
  }

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await fetch('/api/courses')
        if (courseRes.ok) {
          const courseData = await courseRes.json()
          setCourses(courseData.data)
        }

        const userRes = await fetch('/api/users')
        if (userRes.ok) {
          const userData = await userRes.json()

          let loadedUsers: User[] = []

          // normalize API response
          if (Array.isArray(userData)) loadedUsers = userData
          else if (Array.isArray(userData.users)) loadedUsers = userData.users
          else if (Array.isArray(userData.data)) loadedUsers = userData.data

          // keep only regular users
          const filtered = loadedUsers.filter((u) => u.role === 'USER')

          setUsers(filtered)
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load form data')
      }
    }
    fetchData()
  }, [])

  // --- Submit Logic ---
  const onSubmit = async (data: ApplicationFormData) => {
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error('Please select at least one document.')
        return
      }

      setIsUploading(true)

      // Create a unique subfolder for this documents
      // const applicationFolder = `application/${uuidv4()}`
      const uploadedDocs: { url: string; fileId: string }[] = []

      // Upload loop
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
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

          if (!res || !res.url || !res.fileId)
            throw new Error(`Upload failed for ${file.name}`)

          uploadedDocs.push({ url: res.url, fileId: res.fileId })
        } catch (err) {
          console.error(err)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (uploadedDocs.length === 0) {
        setIsUploading(false)
        toast.error('All uploads failed. Please try again.')
        return
      }

      // Update form data with uploaded URLs
      setValue('documents', uploadedDocs, { shouldValidate: true })

      const payload = {
        ...data,
        documents: uploadedDocs,
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Application created successfully!')
        setSelectedFiles(null)

        router.push('/dashboard/admin/applications')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to create application')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 py-12 space-y-4 rounded-xl"
      >
        {/* users */}
        <div>
          <Controller
            control={control}
            name="applicantId" // Matches your Zod schema
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Applicant" />
                </SelectTrigger>
                <SelectContent>
                  {users?.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {/* DISPLAY LOGIC: Name + (Unique Identifier) */}
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          {/* Show email if exists, otherwise phone */}(
                          {user.email || user.phone})
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No users found
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.applicantId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.applicantId.message}
            </p>
          )}
        </div>

        {/* course */}
        <div>
          <Controller
            control={control}
            name="courseId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.length > 0 ? (
                    courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No courses found
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.courseId && (
            <p className="text-red-500">{errors.courseId.message}</p>
          )}
        </div>

        {/* status */}
        <div>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Applicantion Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>

        {/* file upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Documents</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, JPG, PNG
            </p>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-semibold mb-2">
                Selected Files ({selectedFiles.length}):
              </p>
              <ul className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center justify-between"
                  >
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className={`w-full py-2 px-4 rounded font-medium text-white transition-all ${
            isUploading || isSubmitting
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isUploading
            ? 'Uploading Documents...'
            : isSubmitting
            ? 'Creating Application...'
            : 'Create Application'}
        </button>
      </form>
    </div>
  )
}
