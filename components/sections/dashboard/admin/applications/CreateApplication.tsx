'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
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
import { v4 as uuidv4 } from 'uuid'
import { upload } from '@imagekit/next'

function disabilityPath(key: DisabilityKey) {
  return `disabilities.${key}` as const
}

export default function CreateApplication() {
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

  // Fetch ImageKit auth params
  const getAuthParams = async () => {
    const res = await fetch('/api/images/upload-auth')
    if (!res.ok) throw new Error('Failed to fetch upload auth')
    return res.json()
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files))
    } else {
      setSelectedFiles(null)
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      if (!selectedFiles || selectedFiles.length === 0) {
        toast.error('Please select at least one document.')
        return
      }

      setIsUploading(true)

      const uploadedDocs: { url: string; fileId: string }[] = []

      for (const file of selectedFiles) {
        const { token, signature, publicKey, expire } = await getAuthParams()
        const uniqueFileName = `${uuidv4()}_${file.name}`

        try {
          const res = await upload({
            file,
            fileName: uniqueFileName,
            folder: 'application',
            token,
            signature,
            publicKey,
            expire,
          })

          if (!res?.url || !res?.fileId) {
            throw new Error('Upload failed')
          }

          uploadedDocs.push({
            url: res.url,
            fileId: res.fileId,
          })
        } catch (err) {
          console.error(err)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (uploadedDocs.length === 0) {
        toast.error('All uploads failed. Please try again.')
        setIsUploading(false)
        return
      }

      // Create user
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values.user),
      })

      const userData = await userRes.json()

      if (!userRes.ok) {
        throw new Error(userData.message || 'Failed to create user')
      }

      const finalValues = {
        ...values,
        documents: uploadedDocs,
      }

      // Create application
      const appRes = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalValues,
          applicantId: userData._id,
        }),
      })

      const appData = await appRes.json()

      if (!appRes.ok) {
        throw new Error(appData.message || 'Failed to create application')
      }

      toast.success('Application submitted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Submission failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-12 max-w-4xl mx-auto py-12 px-6 bg-white shadow-xl rounded-2xl"
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
        <StudentInformationSection form={form} />

        {/* FILE UPLOAD SECTION */}
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

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-semibold mb-2">
                Selected Files ({selectedFiles.length}):
              </p>
              <ul className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex justify-between"
                  >
                    <span className="truncate max-w-[220px]">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024).toFixed(0)} KB
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-full px-8 py-3 text-lg"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
