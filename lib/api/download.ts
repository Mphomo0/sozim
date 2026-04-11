import type { Record } from '@/lib/types'

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export async function downloadRIS(records: Record[]) {
  const { libraryApi } = await import('./library')
  const recordIds = records.map(r => r.id)
  const blob = await libraryApi.exportRIS(recordIds)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadBlob(blob, `library_export_${timestamp}.ris`)
}
