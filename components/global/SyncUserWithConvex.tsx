'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export default function SyncUserWithConvex() {
  const { user, isLoaded, isSignedIn } = useUser()
  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  )
  const convexUserByEmail = useQuery(
    api.users.getUserByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip"
  )
  const createUser = useMutation(api.users.createUser)
  const updateUser = useMutation(api.users.updateUser)

  useEffect(() => {
    // Wait until everything is fully loaded and a user is signed in
    if (!isLoaded || !isSignedIn || !user) return;
    
    // We cannot proceed until convex has attempted a fetch
    if (convexUser === undefined || convexUserByEmail === undefined) return;

    const syncUser = async () => {
      const { id, firstName, lastName, primaryEmailAddress } = user
      const clerkFirst = firstName || ""
      const clerkLast = lastName || ""
      const clerkEmail = primaryEmailAddress?.emailAddress || ""

      const existingUser = convexUser

      if (!existingUser) {
        // 1. If user exists with different clerkId (old/migrated account) - update their clerkId
        if (convexUserByEmail) {
          await updateUser({
            id: convexUserByEmail._id,
            clerkId: id,
            firstName: clerkFirst,
            lastName: clerkLast,
          })
        } 
        // 2. If Convex doesn't have this user at all, create them
        else {
          await createUser({
            clerkId: id,
            firstName: clerkFirst,
            lastName: clerkLast,
            email: clerkEmail,
            role: 'USER', // Default role for new sign-ups
          })
        }
      }
      // 3. If Convex does have this user, check if their basic identity details diverged.
      else if (
        existingUser.firstName !== clerkFirst ||
        existingUser.lastName !== clerkLast ||
        existingUser.email !== clerkEmail
      ) {
        await updateUser({
          id: existingUser._id,
          firstName: clerkFirst,
          lastName: clerkLast,
          clerkId: id,
        })
      }
    }

    syncUser()
  }, [user, isLoaded, isSignedIn, convexUser, convexUserByEmail, createUser, updateUser])

  // This is a silent operational component.
  return null
}
