import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import { Record } from '@/models/Record'
import { parseOai } from '@/lib/oai-parser'

const DSPACE_ENDPOINTS: Record<string, string> = {
  uct: 'https://open.uct.ac.za/oai/request',
  spu: 'https://openhub.spu.ac.za/oai/request',
  sun: 'https://scholar.sun.ac.za/server/oai/request',
  ufs: 'https://scholar.ufs.ac.za/server/oai/request',
  up: 'https://repository.up.ac.za/server/oai/request',
  unisa: 'https://uir.unisa.ac.za/server/oai/request',
  nwu: 'https://repository.nwu.ac.za/server/oai/request',
  wits: 'https://wiredspace.wits.ac.za/server/oai/request',
  cut: 'https://cutscholar.cut.ac.za/server/oai/request',
}

const ELIS_ENDPOINT = 'http://eprints.rclis.org/cgi/oai2'

export async function POST(): Promise<NextResponse> {
  try {
    await dbConnect()

    console.log('🔧 Starting URL fix process...')

    let totalFixed = 0
    let totalChecked = 0

    for (const [id, endpoint] of Object.entries(DSPACE_ENDPOINTS)) {
      try {
        const sourceName = getSourceName(id)

        console.log(`\n📚 Checking ${sourceName} (${id})...`)

        const emptyRecords = await Record.find({
          source: sourceName,
          url: { $in: ['', '#'] }
        }).lean()

        if (emptyRecords.length === 0) {
          console.log(`   ✅ ${sourceName}: All records have valid URLs`)
          totalChecked += emptyRecords.length
          continue
        }

        console.log(`   🔍 Found ${emptyRecords.length} records without URLs`)

        const url = `${endpoint}?verb=ListRecords&metadataPrefix=oai_dc`

        const response = await fetch(url)
        const xml = await response.text()

        if (xml.includes('<error')) {
          console.log(`   ❌ ${sourceName}: Error fetching from endpoint`)
          totalChecked += emptyRecords.length
          continue
        }

        const { records: newRecords } = parseOai(xml, id)

        const recordsByUrl = new Map<string, any>()

        for (const r of newRecords) {
          if (r.url && r.url !== '' && r.url !== '#') {
            recordsByUrl.set(r.id, r)
          }
        }

        let updated = 0

        for (const doc of emptyRecords) {
          const newRecord = recordsByUrl.get(doc.id)

          if (newRecord && newRecord.url && newRecord.url !== '' && newRecord.url !== '#') {
            await Record.updateOne(
              { _id: doc._id },
              {
                $set: {
                  url: newRecord.url,
                  identifier: newRecord.identifier,
                  identifierType: newRecord.identifierType,
                }
              }
            )

            updated++
            totalFixed++
          }
        }

        console.log(`   ✅ Updated ${updated} records in ${sourceName}`)

        totalChecked += emptyRecords.length
      } catch (err) {
        console.log(`   ❌ ${id}: Error - ${(err as Error).message}`)
      }
    }

    try {
      console.log(`\n📚 Checking E-LIS...`)

      const sourceName = 'E-LIS e-prints in Library and Information Science'

      const emptyElisRecords = await Record.find({
        source: sourceName,
        url: { $in: ['', '#'] }
      }).lean()

      if (emptyElisRecords.length === 0) {
        console.log(`   ✅ ${sourceName}: All records have valid URLs`)
        totalChecked += emptyElisRecords.length
      } else {
        console.log(`   🔍 Found ${emptyElisRecords.length} E-LIS records without URLs`)

        const url = `${ELIS_ENDPOINT}?verb=ListRecords&metadataPrefix=oai_dc`

        const response = await fetch(url)
        const xml = await response.text()

        if (xml.includes('<error')) {
          console.log(`   ❌ ${sourceName}: Error fetching from endpoint`)
          totalChecked += emptyElisRecords.length
        } else {
          const { records: newRecords } = parseOai(xml, 'elis')

          const recordsByUrl = new Map<string, any>()

          for (const r of newRecords) {
            if (r.url && r.url !== '' && r.url !== '#') {
              recordsByUrl.set(r.id, r)
            }
          }

          let updated = 0

          for (const doc of emptyElisRecords) {
            const newRecord = recordsByUrl.get(doc.id)

            if (newRecord && newRecord.url && newRecord.url !== '' && newRecord.url !== '#') {
              await Record.updateOne(
                { _id: doc._id },
                {
                  $set: {
                    url: newRecord.url,
                    identifier: newRecord.identifier,
                    identifierType: newRecord.identifierType,
                  }
                }
              )

              updated++
              totalFixed++
            }
          }

          console.log(`   ✅ Updated ${updated} E-LIS records`)

          totalChecked += emptyElisRecords.length
        }
      }
    } catch (err) {
      console.log(`   ❌ E-LIS: Error - ${(err as Error).message}`)
    }

    console.log(`\n📊 Final Statistics:`)
    console.log(`   - Total records checked: ${totalChecked}`)
    console.log(`   - Total URLs fixed: ${totalFixed}`)
    console.log(`   - Success rate: ${((totalFixed / totalChecked) * 100).toFixed(1)}%`)

    return NextResponse.json({
      success: true,
      message: `URLs fixed for ${totalFixed} records`,
      stats: {
        totalChecked,
        totalFixed,
        successRate: `${((totalFixed / totalChecked) * 100).toFixed(1)}%`,
      },
    })
  } catch (error) {
    console.error('Fix URLs error:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

function getSourceName(id: string): string {
  const names: Record<string, string> = {
    uct: 'University of Cape Town',
    spu: 'Sol Plaatje University',
    sun: 'Stellenbosch University',
    ufs: 'University of Free State',
    up: 'University of Pretoria',
    unisa: 'University of South Africa',
    nwu: 'North-West University',
    wits: 'University of Witwatersrand',
    cut: 'Central University of Technology',
  }
  return names[id] || id.toUpperCase()
}
