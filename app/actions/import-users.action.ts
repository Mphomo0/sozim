'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { convexClient } from '@/lib/convex-client'
import { api } from '@/convex/_generated/api'

interface CSVRow {
  email_address: string
  first_name: string
  last_name: string
  password_hash?: string
  password_hasher?: string
  external_id?: string
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows: CSVRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    rows.push(row)
  }

  return rows
}

export async function importUsersFromCSV(csvContent: string) {
  const parsed = parseCSV(csvContent)
  
  if (parsed.length === 0) {
    return { 
      success: false, 
      error: 'No valid data found in CSV',
      created: 0,
      linked: 0,
      errors: [] 
    }
  }

  const clerk = await clerkClient()
  
  const results = {
    created: 0,
    linked: 0,
    errors: [] as string[]
  }

  for (const row of parsed) {
    try {
      const email = row.email_address?.trim()
      const firstName = row.first_name?.trim() || ''
      const lastName = row.last_name?.trim() || ''
      const passwordHasher = row.password_hasher?.trim()

      if (!email) {
        results.errors.push(`Row skipped: missing email`)
        continue
      }

      const password = Math.random().toString(36).slice(-10) + 'A1!'

      const clerkUser = await clerk.users.createUser({
        firstName,
        lastName,
        emailAddress: [email],
        password,
        skipPasswordChecks: true,
        skipPasswordRequirement: true,
        externalId: row.external_id || undefined,
      })

      results.created++

      const existingUser = await convexClient.query(api.users.getUserByEmail, { email })

      if (existingUser) {
        await convexClient.mutation(api.users.updateUser, {
          id: existingUser._id,
          clerkId: clerkUser.id,
        })
        results.linked++
      }

    } catch (error: any) {
      console.error('Error importing user:', error)
      results.errors.push(`Failed to import ${row.email_address}: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    success: results.errors.length === 0,
    created: results.created,
    linked: results.linked,
    errors: results.errors
  }
}
