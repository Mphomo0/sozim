import { useState, useEffect } from 'react'
import { libraryApi } from '@/lib/api/library'
import type { HealthResponse } from '@/lib/types'

export function useSystemHealth() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHealth() {
      try {
        const data = await libraryApi.getHealth()
        setHealth(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
  }, [])

  return { health, loading, error }
}
