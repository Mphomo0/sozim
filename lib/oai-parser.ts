import type {
  OAIParseResult,
  BestIdResult,
  Record as RecordType,
  RecordType as RecordTypeEnum,
  IdentifierType,
} from '@/lib/types'
import {
  decode,
  pick,
  year,
  rid,
  sourceMap,
  detectDryad,
  buildRecordUrl,
} from './harvest-utils'

export function extract(xml: string, tag: string): string[] {
  const out: string[] = []
  if (!xml || !tag) return out

  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const base = escapedTag.replace('dc\\:', 'dc[.:]')

  const simpleRe = new RegExp(
    `<${escapedTag}>([\\s\\S]*?)<\\/${escapedTag}>`,
    'gi'
  )
  const extendedRe = new RegExp(`<${base}>([\\s\\S]*?)<\\/dc[.:][^>]+>`, 'gi')

  let m: RegExpExecArray | null
  while ((m = simpleRe.exec(xml))) {
    const content = m[1].trim()
    if (content) {
      const decoded = decode(content)
      if (decoded && decoded.trim()) out.push(decoded.trim())
    }
  }
  while ((m = extendedRe.exec(xml))) {
    const content = m[1].trim()
    if (content) {
      const decoded = decode(content)
      if (decoded && decoded.trim()) out.push(decoded.trim())
    }
  }

  return out
}

export function bestIdForDSpace(
  ids: string[] = [],
  repositoryId: string
): BestIdResult {
  if (!ids || !ids.length) {
    return { identifier: '', identifierType: '', url: '' }
  }

  const normIds = ids
    .filter(Boolean)
    .map((x) => String(x).trim())
    .filter(Boolean)

  if (!normIds.length) {
    return { identifier: '', identifierType: '', url: '' }
  }

  const hdlPattern = /^https?:\/\/hdl\.handle\.net\/\S+/i
  const doiPattern = /^https?:\/\/(dx\.)?doi\.org\/\S+/i

  for (const raw of normIds) {
    const urlMatch = raw.match(/https?:\/\/\S+/i)
    const candidate = urlMatch ? urlMatch[0] : null

    if (candidate && !/[<>]/.test(candidate)) {
      if (hdlPattern.test(candidate)) {
        return {
          identifier: candidate,
          identifierType: 'Handle',
          url: candidate,
        }
      }
      if (doiPattern.test(candidate)) {
        return {
          identifier: candidate.replace(/^https?:\/\/(dx\.)?doi\.org\//i, ''),
          identifierType: 'DOI',
          url: candidate,
        }
      }
      if (/^https?:\/\/\S+\.\S{2,}/i.test(candidate)) {
        return {
          identifier: candidate.split('/').pop() || candidate,
          identifierType: 'ID',
          url: candidate,
        }
      }
    }
  }

  return { identifier: '', identifierType: '', url: '' }
}

export function extractBestUrl(block: string): string {
  const identifiers = extract(block, 'dc:identifier')
  const uriIdentifiers = [
    ...extract(block, 'dc:identifier.uri'),
    ...extract(block, 'dc.identifier.uri'),
  ]
  const relations = [
    ...extract(block, 'dc:relation'),
    ...extract(block, 'dc.relation'),
  ]

  const allUrls = [...identifiers, ...uriIdentifiers, ...relations]

  for (const url of allUrls) {
    if (!url) continue

    const normalized = url.trim()

    if (/^https?:\/\/\S+\.\S+\/\S+\/\S+\.\w{3,4}/i.test(normalized)) {
      return normalized
    }

    if (/^https?:\/\/\S+\.\S{2,}/i.test(normalized)) {
      return normalized
    }

    if (/^https?:\/\/\S+\/\S+/i.test(normalized)) {
      return normalized
    }
  }

  return allUrls[0] || ''
}

export function makeRecordFromBlock(block: string, id: string): RecordType {
  const title = pick(extract(block, 'dc:title')) || 'Untitled'
  const creators = extract(block, 'dc:creator')
  const desc = pick(extract(block, 'dc:description')) || ''
  const subjects = extract(block, 'dc:subject')
  const types = extract(block, 'dc:type').join(' ').toLowerCase()
  const date = pick(extract(block, 'dc:date'))

  const url = extractBestUrl(block)

  if (!url || url.trim() === '') {
    console.log(`   ⚠️ No URL found for record: ${title}`)
  }

  const identifier = url.split('/').filter(Boolean).pop() || url

  let identifierType: IdentifierType = 'ID'
  if (/^https?:\/\/doi\.org\//i.test(url)) {
    identifierType = 'DOI'
  } else if (/^https?:\/\/hdl\.handle\.net\//i.test(url)) {
    identifierType = 'Handle'
  } else if (/\.pdf$/i.test(url)) {
    identifierType = 'ID'
  }

  let type: RecordTypeEnum = 'Other'
  if (/(thesis|dissertation)/i.test(types)) {
    type = 'Thesis/Dissertation'
  } else if (/article/i.test(types)) {
    type = 'Journal Article'
  }

  let record: RecordType = {
    id: `${id}-${rid()}`,
    title,
    authors: creators,
    description: desc,
    keywords: subjects,
    year: year(date),
    source: sourceMap(id),
    type,
    identifier,
    identifierType,
    url: url || '',
  }

  if (record.identifier && detectDryad(record.identifier, record.url)) {
    record.source = 'Dryad Digital Repository'
  }

  console.log(`   Record: ${title} → URL: ${url || 'NONE'} (${identifierType})`)

  return record
}

export function parseOai(xml: string, id: string): OAIParseResult {
  if (!xml || xml.length < 200) {
    console.log(`   parseOai: No XML to parse for ${id}`)
    return { records: [], next: null }
  }

  let next: string | null =
    xml
      .match(/<resumptionToken[^>]*>([\s\S]*?)<\/resumptionToken>/i)?.[1]
      ?.trim() || null
  const recs: RecordType[] = []

  console.log(`   parseOai for ${id}, resumptionToken: ${next ? 'yes' : 'no'}`)

  const hasOAI = /<OAI-PMH/i.test(xml) || /<record>/i.test(xml)
  if (hasOAI) {
    const recRegex = /<record>[\s\S]*?<\/record>/gi
    let m: RegExpExecArray | null
    let count = 0
    while ((m = recRegex.exec(xml))) {
      const block = m[0]
      const record = makeRecordFromBlock(block, id)
      if (record && record.title && record.title !== 'Untitled') {
        recs.push(record)
        count++
      }
    }
    console.log(`   parseOai found ${count} records using record regex`)
    return { records: recs, next }
  }

  const altRegex = /<oai_dc:dc[\s\S]*?<\/oai_dc:dc>/gi
  const blocks = xml.match(altRegex) || []
  console.log(`   parseOai found ${blocks.length} blocks using alt regex`)
  for (const b of blocks) {
    const record = makeRecordFromBlock(b, id)
    if (record && record.title && record.title !== 'Untitled') recs.push(record)
  }

  next = null
  return { records: recs, next }
}
