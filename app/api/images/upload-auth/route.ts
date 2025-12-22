import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

export const GET = auth(async function (req) {
  if (!req.auth)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!.trim() // Important: trim any whitespace
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY!

    const token = uuidv4()
    const expire = Math.floor(Date.now() / 1000) + 2400 // 40 minutes (must be < 1 hour from now)

    // EXACT STRING: token directly concatenated with expire (as number → string implicitly)
    const signatureString = token + expire

    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(signatureString)
      .digest('hex')
      .toLowerCase() // Must be lowercase!

    console.log('Generated auth:', {
      token,
      expire,
      signatureString,
      signature,
    })
    return NextResponse.json({
      token,
      expire, // send as number (client will .toString() it)
      signature,
      publicKey,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
})
