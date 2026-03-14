import { currentUser } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

type RouteHandler = (req: NextRequest & { auth?: any }, ctx: any) => any;

export function auth(): Promise<any>;
export function auth(handler: RouteHandler): any;
export function auth(...args: any[]): any {
  // If called as a wrapper: export const GET = auth(async (req, ctx) => { ... })
  if (args.length === 1 && typeof args[0] === 'function') {
    const handler = args[0]

    return async function (request: NextRequest, context: any) {
      const user = await currentUser()
      const reqAuth = user
        ? {
            user: {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.publicMetadata?.role || 'USER',
            },
          }
        : null
      
      // Inject auth object into request like NextAuth did
      Object.assign(request, { auth: reqAuth })
      return handler(request, context)
    }
  }

  // If called directly: const session = await auth()
  return (async () => {
    const user = await currentUser()
    if (!user) return null

    return {
      user: {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.publicMetadata?.role || 'USER',
        phone: user.publicMetadata?.phone,
        idNumber: user.publicMetadata?.idNumber,
        address: user.publicMetadata?.address,
        nationality: user.publicMetadata?.nationality,
      },
    }
  })()
}


