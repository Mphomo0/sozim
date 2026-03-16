'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { convexClient } from '@/lib/convex-client'
import { api } from '@/convex/_generated/api'

interface CSVRow {
  id: string
  first_name: string
  last_name: string
  primary_email_address: string
  password_digest?: string
  password_hasher?: string
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n')
  if (lines.length < 2) return []

  const delimiter = lines[0].includes('\t') ? '\t' : ','
  const headers = lines[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/"/g, ''))
  const rows: CSVRow[] = []

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
      const email = row.primary_email_address?.trim()
      const firstName = row.first_name?.trim() || ''
      const lastName = row.last_name?.trim() || ''
      const passwordDigest = row.password_digest?.trim()
      const passwordHasher = row.password_hasher?.trim()
      const clerkIdFromCsv = row.id?.trim()

      if (!email) {
        results.errors.push(`Row skipped: missing email`)
        continue
      }

      let clerkUserId: string

      const existingClerkUsers = await clerk.users.getUserList({
        emailAddress: [email],
        limit: 1,
      })

      if (existingClerkUsers.data.length > 0) {
        clerkUserId = existingClerkUsers.data[0].id
        results.created++
      } else {
        const createData: any = {
          firstName,
          lastName,
          emailAddress: [email],
          externalId: clerkIdFromCsv || undefined,
        }

        if (passwordDigest && passwordHasher && passwordHasher.toLowerCase() === 'bcrypt') {
          createData.passwordDigest = passwordDigest
          createData.passwordHasher = 'bcrypt'
        } else {
          createData.password = Math.random().toString(36).slice(-10) + 'A1!'
          createData.skipPasswordChecks = true
          createData.skipPasswordRequirement = true
        }

        const clerkUser = await clerk.users.createUser(createData)
        clerkUserId = clerkUser.id
        results.created++
      }

      const existingUser = await convexClient.query(api.users.getUserByEmail, { email })

      if (existingUser) {
        await convexClient.mutation(api.users.updateUser, {
          id: existingUser._id,
          clerkId: clerkUserId,
        })
        results.linked++
      }

    } catch (error: any) {
      console.error('Error importing user:', error)
      results.errors.push(`Failed to import ${row.primary_email_address}: ${error.message || 'Unknown error'}`)
    }
  }

  return {
    success: results.errors.length === 0,
    created: results.created,
    linked: results.linked,
    errors: results.errors
  }
}
