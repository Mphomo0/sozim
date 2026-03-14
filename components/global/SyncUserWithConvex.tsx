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
  const createUser = useMutation(api.users.createUser)
  const updateUser = useMutation(api.users.updateUser)

  useEffect(() => {
    // Wait until everything is fully loaded and a user is signed in
    if (!isLoaded || !isSignedIn || !user) return;
    
    // We cannot proceed until convex has attempted a fetch
    if (convexUser === undefined) return;

    const syncUser = async () => {
      const { id, firstName, lastName, primaryEmailAddress } = user
      const clerkFirst = firstName || ""
      const clerkLast = lastName || ""
      const clerkEmail = primaryEmailAddress?.emailAddress || ""

      // 1. If Convex doesn't have this user, create them.
      if (convexUser === null) {
        await createUser({
          clerkId: id,
          firstName: clerkFirst,
          lastName: clerkLast,
          email: clerkEmail,
          role: 'USER', // Default role for new sign-ups
        })
      } 
      // 2. If Convex does have this user, check if their basic identity details diverged.
      else if (
        convexUser.firstName !== clerkFirst ||
        convexUser.lastName !== clerkLast ||
        convexUser.email !== clerkEmail
      ) {
        await updateUser({
          id: convexUser._id,
          firstName: clerkFirst,
          lastName: clerkLast,
          clerkId: id,
          // note: our user schema doesn't strictly have an email mutation handle inside 'updateUser'
          // If we had strict email updates we could do them, but typically Clerk is master.
        })
      }
    }

    syncUser()
  }, [user, isLoaded, isSignedIn, convexUser, createUser, updateUser])

  // This is a silent operational component.
  return null
}
