'use server'

import { convexClient } from '@/lib/convex-client'
import { api } from '@/convex/_generated/api'

interface ClerkCSVRow {
  id: string
  first_name: string
  last_name: string
  primary_email_address: string
}

function parseClerkCSV(content: string): ClerkCSVRow[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const delimiter = lines[0].includes('\t') ? '\t' : ','
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''))
  const rows: ClerkCSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = line.split(delimiter).map(v => v.trim().replace(/"/g, ''))
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

export async function updateConvexUsersWithClerkIds(csvContent: string) {
  const parsed = parseClerkCSV(csvContent)
  
  if (parsed.length === 0) {
    return { 
      success: false, 
      error: 'No valid data found in CSV',
      updated: 0,
      errors: [] 
    }
  }

  const results = {
    updated: 0,
    errors: [] as string[]
  }

  for (const row of parsed) {
    try {
      const clerkId = row.id?.trim()
      const email = row.primary_email_address?.trim()

      if (!clerkId || !email) {
        results.errors.push(`Row skipped: missing clerkId or email`)
        continue
      }

      const existingUser = await convexClient.query(api.users.getUserByEmail, { email })

      if (existingUser) {
        await convexClient.mutation(api.users.updateUser, {
          id: existingUser._id,
          clerkId: clerkId,
        })
        results.updated++
      } else {
        results.errors.push(`No Convex user found for email: ${email}`)
      }

    } catch (error: any) {
      console.error('Error updating user:', error)
      results.errors.push(`Failed to update ${row.primary_email_address}: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    success: results.errors.length === 0,
    updated: results.updated,
    errors: results.errors
  }
}
