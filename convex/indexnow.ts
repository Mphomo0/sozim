import { v } from 'convex/values'
import { internalAction } from './_generated/server'

const INDEXNOW_KEY = '8kz47utpv4n9yx358tzkfsbh6r2fsqzy'
const HOST = 'www.sozim.co.za'
const BASE_URL = `https://${HOST}`
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`

export const pingUrls = internalAction({
  args: { urls: v.array(v.string()) },
  handler: async (_ctx, { urls }) => {
    const urlList = urls
      .map((u) => (u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? u : `/${u}`}`))
      .filter((u) => u.startsWith(BASE_URL))

    if (urlList.length === 0) return { ok: false, reason: 'no urls' }

    const res = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    })

    if (!res.ok && res.status !== 202) {
      console.error('IndexNow ping failed', res.status, await res.text())
      return { ok: false, status: res.status }
    }
    return { ok: true, status: res.status, count: urlList.length }
  },
})
