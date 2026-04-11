import { useState, useCallback } from 'react'
import { getConvexClient } from '@/lib/convex-client'
import { api } from '@/convex/_generated/api'

interface UseManualHarvestResult {
  trigger: (type?: 'full' | 'incremental') => Promise<{ success: boolean; message: string; jobId: string }>
  loading: boolean
  error: string | null
  lastJobId: string | null
}

export function useManualHarvest(): UseManualHarvestResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastJobId, setLastJobId] = useState<string | null>(null)

  const trigger = useCallback(async (type: 'full' | 'incremental' = 'full') => {
    setLoading(true)
    setError(null)

    try {
      const result = await getConvexClient()!.action(api.harvest.manualHarvest, { type })
      if (result.success && result.jobId) {
        setLastJobId(result.jobId)
      }
      setLoading(false)
      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Manual harvest failed'
      setError(errorMsg)
      setLoading(false)
      return { success: false, message: errorMsg, jobId: '' }
    }
  }, [])

  return { trigger, loading, error, lastJobId }
}