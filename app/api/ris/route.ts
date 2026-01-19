import { NextResponse, NextRequest } from 'next/server'
import type { RISExportRequest, Record as RecordType } from '@/lib/types'

function toRIS(r: RecordType): string[] {
  const isThesis = /(thesis|dissertation)/i.test(r.type || '')
  const isArticle = /article/i.test(r.type || '')
  const out: string[] = []
  out.push('TY  - ' + (isThesis ? 'THES' : isArticle ? 'JOUR' : 'DATA'))
  if (r.title) out.push('TI  - ' + r.title)
  ;(r.authors || []).forEach((a) => a && out.push('AU  - ' + a))
  if (r.year) out.push('PY  - ' + r.year)
  if (r.source) out.push('PB  - ' + r.source)
  if (r.description) out.push('AB  - ' + r.description.slice(0, 500))
  if (r.url) out.push('UR  - ' + r.url)
  if (/^10\.\d{4,9}\//.test(r.identifier || ''))
    out.push('DO  - ' + r.identifier)
  out.push('ER  - ')
  return out
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { records = [] }: RISExportRequest = await request
      .json()
      .catch(() => ({ records: [] }))
    const lines = records.flatMap(toRIS)

    return new NextResponse(lines.join('\r\n') + '\r\n', {
      headers: {
        'Content-Type': 'application/x-research-info-systems',
        'Content-Disposition': 'attachment; filename="library_export.ris"',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('RIS export error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
