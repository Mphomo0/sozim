// components/ui/YearSelector.tsx
'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentYear: number
  selectedYear: number
}

export default function YearSelector({ currentYear, selectedYear }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value

    // 1. Create a new URLSearchParams object from the current ones
    const params = new URLSearchParams(searchParams.toString())

    // 2. Set the new 'year' parameter
    params.set('year', newYear)

    // 3. Navigate to the new URL
    router.push(`/dashboard?${params.toString()}`)

    // NOTE: I replaced the original window.location.replace with router.push
    // This provides a better, client-side navigation experience without full page reload.
  }

  // Generate the years for the dropdown
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]

  return (
    <form>
      <select
        name="year"
        defaultValue={selectedYear}
        className="border p-2 rounded"
        onChange={handleYearChange} // <--- The onChange handler is now safe here
      >
        {years.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>
    </form>
  )
}
