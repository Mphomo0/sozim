import { describe, it, expect } from 'vitest'
import {
  detectDryad,
  detectZenodo,
  detectMendeley,
  sourceMap,
  repositoryBaseUrl,
  buildRecordUrl,
  pick,
  year,
  stripHtml,
  decode,
  rid,
  sleep,
  createRecordSignature,
  accumulativeDedupe,
  DSPACE_ENDPOINTS,
  RESEARCH_DATA_SOURCES,
  USER_AGENT,
  PAGE_SIZE_DEFAULT,
  RECORDS_PER_REPOSITORY,
  INCREMENTAL_RECORDS,
} from '@/lib/harvest-utils'
import type { Record as RecordType } from '@/lib/types'

describe('harvest-utils constants', () => {
  it('should export correct USER_AGENT', () => {
    expect(USER_AGENT).toBe('Academic-Library-Harvester/3.4.0')
  })

  it('should export correct PAGE_SIZE_DEFAULT', () => {
    expect(PAGE_SIZE_DEFAULT).toBe(24)
  })

  it('should export correct RECORDS_PER_REPOSITORY', () => {
    expect(RECORDS_PER_REPOSITORY).toBe(40)
  })

  it('should export correct INCREMENTAL_RECORDS', () => {
    expect(INCREMENTAL_RECORDS).toBe(40)
  })

  it('should export all DSpace endpoints', () => {
    expect(DSPACE_ENDPOINTS.uct).toBe('https://open.uct.ac.za/oai/request')
    expect(DSPACE_ENDPOINTS.spu).toBe('https://openhub.spu.ac.za/oai/request')
    expect(DSPACE_ENDPOINTS.sun).toBe('https://scholar.sun.ac.za/server/oai/request')
    expect(DSPACE_ENDPOINTS.ufs).toBe('https://scholar.ufs.ac.za/server/oai/request')
    expect(DSPACE_ENDPOINTS.up).toBe('https://repository.up.ac.za/server/oai/request')
    expect(DSPACE_ENDPOINTS.unisa).toBe('https://uir.unisa.ac.za/server/oai/request')
    expect(DSPACE_ENDPOINTS.nwu).toBe('https://repository.nwu.ac.za/server/oai/request')
    expect(DSPACE_ENDPOINTS.wits).toBe('https://wiredspace.wits.ac.za/server/oai/request')
    expect(DSPACE_ENDPOINTS.cut).toBe('https://cutscholar.cut.ac.za/server/oai/request')
  })

  it('should export research data sources', () => {
    expect(RESEARCH_DATA_SOURCES).toHaveLength(3)
    expect(RESEARCH_DATA_SOURCES[0].name).toBe('dryad')
    expect(RESEARCH_DATA_SOURCES[1].name).toBe('zenodo')
    expect(RESEARCH_DATA_SOURCES[2].name).toBe('mendeley')
  })
})

describe('detectDryad', () => {
  it('should detect Dryad by DOI prefix 10.5061', () => {
    expect(detectDryad('10.5061/dryad.123')).toBe(true)
  })

  it('should detect Dryad by DOI prefix 10.6071', () => {
    expect(detectDryad('10.6071/M3NP08')).toBe(true)
  })

  it('should detect Dryad by URL', () => {
    expect(detectDryad('', 'https://datadryad.org/stash/dataset/123')).toBe(true)
  })

  it('should return false for non-Dryad identifiers', () => {
    expect(detectDryad('10.1234/abc')).toBe(false)
    expect(detectDryad('', 'https://zenodo.org/record/123')).toBe(false)
  })

  it('should handle empty inputs', () => {
    expect(detectDryad()).toBe(false)
    expect(detectDryad('', '')).toBe(false)
  })

  it('should be case insensitive', () => {
    expect(detectDryad('10.5061/DRYAD', '')).toBe(true)
    expect(detectDryad('', 'https://datadryad.org/test')).toBe(true)
  })
})

describe('detectZenodo', () => {
  it('should detect Zenodo by DOI prefix 10.5281', () => {
    expect(detectZenodo('10.5281/zenodo.123')).toBe(true)
  })

  it('should detect Zenodo by identifier containing zenodo', () => {
    expect(detectZenodo('zenodo.123456')).toBe(true)
  })

  it('should detect Zenodo by URL', () => {
    expect(detectZenodo('', 'https://zenodo.org/record/123')).toBe(true)
  })

  it('should return false for non-Zenodo identifiers', () => {
    expect(detectZenodo('10.1234/abc')).toBe(false)
    expect(detectZenodo('', 'https://dryad.org/')).toBe(false)
  })

  it('should handle empty inputs', () => {
    expect(detectZenodo()).toBe(false)
  })
})

describe('detectMendeley', () => {
  it('should detect Mendeley by DOI prefix 10.17632', () => {
    expect(detectMendeley('10.17632/abc123')).toBe(true)
  })

  it('should detect Mendeley by URL', () => {
    expect(detectMendeley('', 'https://data.mendeley.com/dataset/123')).toBe(true)
  })

  it('should return false for non-Mendeley identifiers', () => {
    expect(detectMendeley('10.1234/abc')).toBe(false)
    expect(detectMendeley('', 'https://zenodo.org/')).toBe(false)
  })

  it('should handle empty inputs', () => {
    expect(detectMendeley()).toBe(false)
  })
})

describe('sourceMap', () => {
  it('should return correct source names for known repositories', () => {
    expect(sourceMap('uct')).toBe('University of Cape Town')
    expect(sourceMap('spu')).toBe('Sol Plaatje University')
    expect(sourceMap('sun')).toBe('Stellenbosch University')
    expect(sourceMap('ufs')).toBe('University of Free State')
    expect(sourceMap('up')).toBe('University of Pretoria')
    expect(sourceMap('unisa')).toBe('University of South Africa')
    expect(sourceMap('nwu')).toBe('North-West University')
    expect(sourceMap('wits')).toBe('University of Witwatersrand')
    expect(sourceMap('cut')).toBe('Central University of Technology')
    expect(sourceMap('elis')).toBe('E-LIS e-prints in Library and Information Science')
  })

  it('should uppercase unknown repository IDs', () => {
    expect(sourceMap('unknown')).toBe('UNKNOWN')
  })

  it('should handle case sensitivity', () => {
    expect(sourceMap('UCT')).toBe('UCT')
  })
})

describe('repositoryBaseUrl', () => {
  it('should return correct base URLs for known repositories', () => {
    expect(repositoryBaseUrl('uct')).toBe('https://open.uct.ac.za')
    expect(repositoryBaseUrl('spu')).toBe('https://openhub.spu.ac.za')
    expect(repositoryBaseUrl('sun')).toBe('https://scholar.sun.ac.za')
    expect(repositoryBaseUrl('ufs')).toBe('https://scholar.ufs.ac.za')
    expect(repositoryBaseUrl('up')).toBe('https://repository.up.ac.za')
    expect(repositoryBaseUrl('unisa')).toBe('https://uir.unisa.ac.za')
    expect(repositoryBaseUrl('nwu')).toBe('https://repository.nwu.ac.za')
    expect(repositoryBaseUrl('wits')).toBe('https://wiredspace.wits.ac.za')
    expect(repositoryBaseUrl('cut')).toBe('https://cutscholar.cut.ac.za')
    expect(repositoryBaseUrl('elis')).toBe('http://eprints.rclis.org')
  })

  it('should return empty string for unknown repositories', () => {
    expect(repositoryBaseUrl('unknown')).toBe('')
  })
})

describe('buildRecordUrl', () => {
  it('should return empty string for empty inputs', () => {
    expect(buildRecordUrl('', '')).toBe('')
    expect(buildRecordUrl('uct', '')).toBe('')
    expect(buildRecordUrl('', '123')).toBe('')
  })

  it('should handle Handle URLs', () => {
    const url = 'https://hdl.handle.net/12345/abc'
    expect(buildRecordUrl('uct', url)).toBe(url)
  })

  it('should handle DOI-based URLs', () => {
    expect(buildRecordUrl('uct', '10.1234/test')).toBe('https://doi.org/10.1234/test')
  })

  it('should handle DSpace OAI identifiers', () => {
    expect(buildRecordUrl('uct', 'oai:uct:123')).toBe('https://open.uct.ac.za/handle/uct/123')
  })

  it('should handle E-LIS URLs that are already full URLs', () => {
    expect(buildRecordUrl('elis', 'http://eprints.rclis.org/12345/')).toBe('http://eprints.rclis.org/12345/')
  })

  it('should handle E-LIS identifiers and construct URLs', () => {
    expect(buildRecordUrl('elis', '12345')).toBe('http://eprints.rclis.org/12345/')
  })

  it('should handle identifiers with oai: prefix', () => {
    expect(buildRecordUrl('uct', 'oai:uct:456')).toContain('/handle/uct/456')
  })

  it('should strip oai: prefix before processing', () => {
    expect(buildRecordUrl('uct', 'oai:uct:789')).toContain('/789')
  })
})

describe('pick', () => {
  it('should return first element from array', () => {
    expect(pick(['a', 'b', 'c'])).toBe('a')
  })

  it('should return empty string for empty array', () => {
    expect(pick([])).toBe('')
  })

  it('should return empty string for undefined', () => {
    expect(pick(undefined)).toBe('')
  })
})

describe('year', () => {
  it('should extract 4-digit year from string', () => {
    expect(year('2023')).toBe(2023)
    expect(year('2021-05-15')).toBe(2021)
    expect(year('Published in 2022')).toBe(2022)
  })

  it('should return undefined for empty input', () => {
    expect(year('')).toBe(undefined)
  })

  it('should return undefined for strings without year', () => {
    expect(year('no year here')).toBe(undefined)
  })

  it('should handle numbers', () => {
    expect(year(2023)).toBe(2023)
  })
})

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello')
    expect(stripHtml('<strong>Bold</strong>')).toBe('Bold')
  })

  it('should collapse whitespace', () => {
    expect(stripHtml('Hello    World')).toBe('Hello World')
    expect(stripHtml('  Hello  ')).toBe('Hello')
  })

  it('should handle empty input', () => {
    expect(stripHtml('')).toBe('')
  })

  it('should handle nested tags', () => {
    expect(stripHtml('<div><p>Nested <strong>text</strong></p></div>')).toBe('Nested text')
  })
})

describe('decode', () => {
  it('should decode HTML entities', () => {
    expect(decode('&lt;')).toBe('<')
    expect(decode('&gt;')).toBe('>')
    expect(decode('&amp;')).toBe('&')
    expect(decode('&quot;')).toBe('"')
    expect(decode('&#39;')).toBe("'")
  })

  it('should decode multiple entities', () => {
    expect(decode('&lt;script&gt;')).toBe('<script>')
  })

  it('should handle empty input', () => {
    expect(decode('')).toBe('')
  })
})

describe('rid', () => {
  it('should generate a random ID', () => {
    const id = rid()
    expect(typeof id).toBe('string')
    expect(id.length).toBe(16)
  })

  it('should generate unique IDs', () => {
    const id1 = rid()
    const id2 = rid()
    expect(id1).not.toBe(id2)
  })

  it('should generate hex string', () => {
    const id = rid()
    expect(/^[0-9a-f]+$/i.test(id)).toBe(true)
  })
})

describe('sleep', () => {
  it('should delay execution', async () => {
    const start = Date.now()
    await sleep(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(90)
    expect(elapsed).toBeLessThan(200)
  })
})

describe('createRecordSignature', () => {
  it('should create signature from identifier when available', () => {
    const record: RecordType = {
      id: '1',
      title: 'Test',
      authors: ['Author'],
      keywords: [],
      source: 'Test Source',
      type: 'Thesis',
      year: 2023,
      identifier: 'doi:10.1234/test',
    }
    const sig = createRecordSignature(record)
    expect(sig).toBe('test source-doi:10.1234/test')
  })

  it('should create signature from title, authors, year when no identifier', () => {
    const record: RecordType = {
      id: '1',
      title: 'Test Paper',
      authors: ['John Doe', 'Jane Smith'],
      keywords: [],
      source: 'Journal',
      type: 'Article',
      year: 2022,
    }
    const sig = createRecordSignature(record)
    expect(sig).toBe('journal-test paper-john doe,jane smith-2022')
  })

  it('should handle empty authors', () => {
    const record: RecordType = {
      id: '1',
      title: 'No Authors',
      authors: [],
      keywords: [],
      source: 'Source',
      type: 'Other',
      year: 2021,
    }
    const sig = createRecordSignature(record)
    expect(sig).toContain('no authors')
  })

  it('should be case insensitive', () => {
    const record1: RecordType = {
      id: '1',
      title: 'TITLE',
      authors: ['AUTHOR'],
      keywords: [],
      source: 'SOURCE',
      type: 'Type',
      identifier: 'ID',
    }
    const record2: RecordType = {
      id: '2',
      title: 'title',
      authors: ['author'],
      keywords: [],
      source: 'source',
      type: 'type',
      identifier: 'id',
    }
    expect(createRecordSignature(record1)).toBe(createRecordSignature(record2))
  })
})

describe('accumulativeDedupe', () => {
  it('should remove duplicates based on signature', () => {
    const record1: RecordType = {
      id: '1',
      title: 'Same Title',
      authors: ['Author'],
      keywords: [],
      source: 'Source',
      type: 'Type',
      identifier: 'id-123',
    }
    const record2: RecordType = {
      id: '2',
      title: 'Same Title',
      authors: ['Author'],
      keywords: [],
      source: 'Source',
      type: 'Type',
      identifier: 'id-123',
    }
    const record3: RecordType = {
      id: '3',
      title: 'Different Title',
      authors: ['Author'],
      keywords: [],
      source: 'Source',
      type: 'Type',
      identifier: 'id-456',
    }

    const result = accumulativeDedupe([record1, record2, record3])
    expect(result).toHaveLength(2)
  })

  it('should skip records without id', () => {
    const recordWithoutId: RecordType = {
      id: '',
      title: 'No ID',
      authors: [],
      keywords: [],
      source: 'Source',
      type: 'Type',
    }
    const result = accumulativeDedupe([recordWithoutId])
    expect(result).toHaveLength(0)
  })

  it('should return empty array for empty input', () => {
    expect(accumulativeDedupe([])).toEqual([])
  })

  it('should preserve order of first occurrence', () => {
    const record1: RecordType = {
      id: '1',
      title: 'First',
      authors: [],
      keywords: [],
      source: 'Source',
      type: 'Type',
      identifier: 'first',
    }
    const record2: RecordType = {
      id: '2',
      title: 'Second',
      authors: [],
      keywords: [],
      source: 'Source',
      type: 'Type',
      identifier: 'second',
    }
    const duplicate1: RecordType = {
      id: '3',
      title: 'First',
      authors: [],
      keywords: [],
      source: 'Source',
      type: 'Type',
      identifier: 'first',
    }

    const result = accumulativeDedupe([record1, record2, duplicate1])
    expect(result[0].id).toBe('1')
    expect(result[1].id).toBe('2')
    expect(result).toHaveLength(2)
  })
})
