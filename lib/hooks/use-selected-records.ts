import { useState, useCallback } from 'react'
import type { Record as RecordType } from '@/lib/types'

export function useSelectedRecords() {
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set())

  const toggleRecord = useCallback((recordId: string) => {
    setSelectedRecords((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(recordId)) {
        newSet.delete(recordId)
      } else {
        newSet.add(recordId)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback((records: RecordType[]) => {
    setSelectedRecords(new Set(records.map((r) => r.id)))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedRecords(new Set())
  }, [])

  const isSelected = useCallback(
    (recordId: string) => {
      return selectedRecords.has(recordId)
    },
    [selectedRecords],
  )

  const getSelectedRecords = useCallback(
    (allRecords: RecordType[]) => {
      return allRecords.filter((r) => selectedRecords.has(r.id))
    },
    [selectedRecords],
  )

  return {
    selectedRecords,
    selectedCount: selectedRecords.size,
    toggleRecord,
    selectAll,
    clearSelection,
    isSelected,
    getSelectedRecords,
  }
}
