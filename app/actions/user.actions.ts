'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { getConvexClient, api } from '@/lib/convex-client'

export async function createUserInClerk(data: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}) {
  try {
    const client = await clerkClient();
    
    // Clerk requires at least a generic password if one isn't provided for normal email accounts,
    // but we can generate a random strong one if omitting isn't allowed.
    // Usually password is required for email-based creation unless using passkeys.
    const passwordToUse = data.password || Math.random().toString(36).slice(-10) + 'A1!';

    const user = await client.users.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: [data.email],
      password: passwordToUse,
      skipPasswordChecks: true, // as admin we can create it
      skipPasswordRequirement: data.password ? false : true,
    })

    return { success: true, clerkId: user.id }
  } catch (error: any) {
    console.error('Error creating user in Clerk:', error)
    return { success: false, error: error.errors?.[0]?.longMessage || error.message || 'Failed to create user in authentication provider' }
  }
}

export async function updateUserInClerk(
  clerkId: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
  }
) {
  if (!clerkId) return { success: false, error: 'No Clerk ID provided' }
  
  try {
    const client = await clerkClient()
    const updateData: any = {}
    
    if (data.firstName !== undefined) updateData.firstName = data.firstName
    if (data.lastName !== undefined) updateData.lastName = data.lastName
    if (data.password !== undefined && data.password !== '') {
      updateData.password = data.password
      updateData.skipPasswordChecks = true
    }
    if (data.email !== undefined) updateData.emailAddress = [{ email: data.email, toExistingAddressStrategy: 'create' }]
    if (data.phone !== undefined) {
      updateData.phoneNumbers = data.phone ? [{ phoneNumber: data.phone }] : []
    }

    if (Object.keys(updateData).length > 0) {
      await client.users.updateUser(clerkId, updateData)
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error updating user in Clerk:', error)
    return { success: false, error: error.errors?.[0]?.longMessage || error.message || 'Failed to update user in authentication provider' }
  }
}

export async function deleteUserInClerk(clerkId: string) {
  if (!clerkId) return { success: false, error: 'No Clerk ID provided' }
  
  try {
    const client = await clerkClient()
    await client.users.deleteUser(clerkId)
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting user in Clerk:', error)
    if (error.status === 404) {
       // If already not found in Clerk, we can still proceed to delete in Convex
       return { success: true }
    }
    return { success: false, error: error.errors?.[0]?.longMessage || error.message || 'Failed to delete user in authentication provider' }
  }
}

export async function cleanupDuplicateUsers(email: string, clerkId: string) {
  try {
    const result = await getConvexClient()!.mutation(api.migration.cleanupDuplicateUsers, { email, clerkId })
    return result
  } catch (error: any) {
    console.error('Error cleaning up duplicate users:', error)
    return { success: false, error: error.message || 'Failed to cleanup duplicates' }
  }
}
