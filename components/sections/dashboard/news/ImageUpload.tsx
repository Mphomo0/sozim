'use client'

import { useState } from 'react'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string | undefined) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const authRes = await fetch('/api/images/upload-auth')
      if (!authRes.ok) throw new Error('Failed to get upload auth')
      const auth = await authRes.json()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)
      formData.append('token', auth.token)
      formData.append('expire', auth.expire)
      formData.append('signature', auth.signature)
      formData.append('publicKey', auth.publicKey)
      formData.append('useUniqueFileName', 'true')
      formData.append('folder', '/news')

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      const result = await uploadRes.json()
      onChange(result.url)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  if (value) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <Image
          src={value}
          alt="Featured image"
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <label className="cursor-pointer">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white"
              >
                Change
              </Button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onChange(undefined)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <label className="relative cursor-pointer">
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all">
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ImagePlus className="w-8 h-8 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Click to upload featured image</span>
            <span className="text-xs text-gray-400">JPG, PNG, WebP</span>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </label>
  )
}
