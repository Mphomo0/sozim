import { getUploadAuthParams } from '@imagekit/next/server'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'

//Create a token cache to prevent reuse
const usedTokens = new Set()

export const GET = auth(async function (req) {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Generate a unique token that hasn't been used before
  let token = uuidv4()

  // In the unlikely event of a collision, generate a new one
  while (usedTokens.has(token)) {
    token = uuidv4()
  }

  // In the unlikely event of a collision, generate a new one
  while (usedTokens.has(token)) {
    token = uuidv4()
  }

  // Clean up the cache occasionally to prevent memory leaks
  // Only keep the most recent 1000 tokens
  if (usedTokens.size > 1000) {
    const iterator = usedTokens.values()
    usedTokens.delete(iterator.next().value)
  }

  const { expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    token,
  })

  console.log(token)

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  })
})
