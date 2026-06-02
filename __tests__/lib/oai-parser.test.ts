import { describe, it, expect } from 'vitest'
import {
  extract,
  bestIdForDSpace,
  extractBestUrl,
  makeRecordFromBlock,
  parseOai,
} from '@/lib/oai-parser'

describe('extract', () => {
  it('should extract simple XML tags', () => {
    const xml = '<dc:title>Test Title</dc:title>'
    const result = extract(xml, 'dc:title')
    expect(result).toContain('Test Title')
  })

  it('should extract multiple occurrences', () => {
    const xml = `
      <dc:creator>Author 1</dc:creator>
      <dc:creator>Author 2</dc:creator>
      <dc:creator>Author 3</dc:creator>
    `
    const result = extract(xml, 'dc:creator')
    expect(result.length).toBeGreaterThanOrEqual(3)
    expect(result).toContain('Author 1')
    expect(result).toContain('Author 2')
    expect(result).toContain('Author 3')
  })

  it('should decode HTML entities', () => {
    const xml = '<dc:title>Test &amp; More &lt;stuff&gt;</dc:title>'
    const result = extract(xml, 'dc:title')
    expect(result).toContain('Test & More <stuff>')
  })

  it('should return empty array for non-existent tags', () => {
    const xml = '<dc:title>Title</dc:title>'
    const result = extract(xml, 'dc:subject')
    expect(result).toEqual([])
  })

  it('should return empty array for empty XML', () => {
    expect(extract('', 'dc:title')).toEqual([])
    expect(extract(null as any, 'dc:title')).toEqual([])
  })

  it('should handle extended namespace tags', () => {
    const xml = '<dc:title>Title</dc:title><dc:description>Desc</dc:description>'
    expect(extract(xml, 'dc:title')).toContain('Title')
    expect(extract(xml, 'dc:description')).toContain('Desc')
  })

  it('should trim whitespace', () => {
    const xml = '<dc:title>   Whitespace   </dc:title>'
    const result = extract(xml, 'dc:title')
    expect(result.some(v => v.trim() === 'Whitespace')).toBe(true)
  })
})

describe('bestIdForDSpace', () => {
  it('should extract Handle URLs', () => {
    const result = bestIdForDSpace(
      ['https://hdl.handle.net/12345/abc'],
      'uct'
    )
    expect(result.identifierType).toBe('Handle')
    expect(result.identifier).toBe('https://hdl.handle.net/12345/abc')
  })

  it('should extract DOI URLs', () => {
    const result = bestIdForDSpace(
      ['https://doi.org/10.1234/test'],
      'uct'
    )
    expect(result.identifierType).toBe('DOI')
    expect(result.identifier).toBe('10.1234/test')
  })

  it('should extract DOI from dx.doi.org', () => {
    const result = bestIdForDSpace(
      ['https://dx.doi.org/10.1234/test'],
      'uct'
    )
    expect(result.identifierType).toBe('DOI')
    expect(result.identifier).toBe('10.1234/test')
  })

  it('should extract URL from embedded URL', () => {
    const result = bestIdForDSpace(
      ['See http://example.com/path/123 for details'],
      'uct'
    )
    expect(result.identifierType).toBe('ID')
    expect(result.url).toBe('http://example.com/path/123')
  })

  it('should return empty for empty input', () => {
    expect(bestIdForDSpace([], 'uct')).toEqual({
      identifier: '',
      identifierType: '',
      url: '',
    })
  })

  it('should return empty for invalid identifiers', () => {
    expect(bestIdForDSpace(['not a valid url'], 'uct')).toEqual({
      identifier: '',
      identifierType: '',
      url: '',
    })
  })

  it('should handle identifiers with angle brackets', () => {
    const result = bestIdForDSpace(
      ['See <http://example.com> for info'],
      'uct'
    )
    expect(result.identifier).toBe('')
  })

  it('should return first matching ID in order', () => {
    const result = bestIdForDSpace(
      [
        'https://doi.org/10.1234/test',
        'https://hdl.handle.net/12345/abc',
      ],
      'uct'
    )
    expect(result.identifierType).toBe('DOI')
  })

  it('should return first matching type in order of checking', () => {
    const result = bestIdForDSpace(
      [
        'http://example.com/path',
        'https://doi.org/10.1234/test',
      ],
      'uct'
    )
    expect(result.identifierType).toBe('ID')
  })
})

describe('extractBestUrl', () => {
  it('should extract URL from dc:identifier.uri', () => {
    const block = `
      <dc:identifier.uri>https://example.com/publication/123</dc:identifier.uri>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://example.com/publication/123')
  })

  it('should extract URL from dc.identifier.uri', () => {
    const block = `
      <dc.identifier.uri>https://example.com/publication/456</dc.identifier.uri>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://example.com/publication/456')
  })

  it('should extract URL from dc:relation', () => {
    const block = `
      <dc:relation>https://example.com/related/789</dc:relation>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://example.com/related/789')
  })

  it('should prefer uri identifiers over plain identifiers', () => {
    const block = `
      <dc:identifier>Some text with http://example.com/1 embedded</dc:identifier>
      <dc:identifier.uri>https://example.com/2</dc:identifier.uri>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://example.com/2')
  })

  it('should return first URL if no specific pattern matches', () => {
    const block = `
      <dc:identifier>https://example.com/path</dc:identifier>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://example.com/path')
  })

  it('should return empty string for no URLs', () => {
    const block = '<dc:title>No URL here</dc:title>'
    const result = extractBestUrl(block)
    expect(result).toBe('')
  })

  it('should extract URL with file extension', () => {
    const block = `
      <dc:identifier>https://example.com/docs/file.pdf</dc:identifier>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://example.com/docs/file.pdf')
  })

  it('should handle multiple URLs and return first valid one', () => {
    const block = `
      <dc:identifier>Invalid URL</dc:identifier>
      <dc:identifier>https://valid-url.com/path</dc:identifier>
    `
    const result = extractBestUrl(block)
    expect(result).toBe('https://valid-url.com/path')
  })
})

describe('makeRecordFromBlock', () => {
  it('should create record with title from dc:title', () => {
    const block = `
      <record>
        <metadata>
          <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
            <dc:title>Research Paper Title</dc:title>
            <dc:creator>John Doe</dc:creator>
            <dc:date>2023</dc:date>
            <dc:type>Thesis</dc:type>
            <dc:identifier.uri>https://example.com/handle/123</dc:identifier.uri>
          </oai_dc:dc>
        </metadata>
      </record>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.title).toBe('Research Paper Title')
    expect(record.authors).toContain('John Doe')
    expect(record.year).toBe(2023)
  })

  it('should handle thesis/dissertation type', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>PhD Thesis</dc:title>
        <dc:type>Thesis/Dissertation</dc:type>
        <dc:identifier.uri>https://example.com/123</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.type).toBe('Thesis/Dissertation')
  })

  it('should handle article type', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Journal Article</dc:title>
        <dc:type>Article</dc:type>
        <dc:identifier.uri>https://example.com/456</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.type).toBe('Journal Article')
  })

  it('should set source from repository ID', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:identifier.uri>https://example.com/789</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.source).toBe('University of Cape Town')
  })

  it('should extract keywords from dc:subject', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:subject>Keyword1</dc:subject>
        <dc:subject>Keyword2</dc:subject>
        <dc:subject>Keyword3</dc:subject>
        <dc:identifier.uri>https://example.com/abc</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.keywords.length).toBeGreaterThanOrEqual(3)
    expect(record.keywords).toContain('Keyword1')
    expect(record.keywords).toContain('Keyword2')
    expect(record.keywords).toContain('Keyword3')
  })

  it('should extract description from dc:description', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:description>This is a test description</dc:description>
        <dc:identifier.uri>https://example.com/desc</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.description).toBe('This is a test description')
  })

  it('should detect Dryad source from identifier', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Dryad Dataset</dc:title>
        <dc:identifier>https://datadryad.org/stash/dataset/10.5061/dryad.123</dc:identifier>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.source).toBe('Dryad Digital Repository')
  })

  it('should use identifierType DOI for doi.org URLs', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:identifier.uri>https://doi.org/10.1234/test</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.identifierType).toBe('DOI')
  })

  it('should use identifierType Handle for hdl.handle.net URLs', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:identifier.uri>https://hdl.handle.net/12345/abc</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.identifierType).toBe('Handle')
  })

  it('should use identifierType ID for PDF URLs', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:identifier.uri>https://example.com/docs/file.pdf</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.identifierType).toBe('ID')
  })

  it('should handle missing dc:title with default', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:identifier.uri>https://example.com/nontitle</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record = makeRecordFromBlock(block, 'uct')
    expect(record.title).toBe('Untitled')
  })

  it('should generate unique record id', () => {
    const block = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Title</dc:title>
        <dc:identifier.uri>https://example.com/id</dc:identifier.uri>
      </oai_dc:dc>
    `
    const record1 = makeRecordFromBlock(block, 'uct')
    const record2 = makeRecordFromBlock(block, 'uct')
    expect(record1.id).not.toBe(record2.id)
  })
})

describe('parseOai', () => {
  it('should parse OAI-PMH XML with records', () => {
    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
        <responseDate>2023-01-01T00:00:00Z</responseDate>
        <request verb="ListRecords">test</request>
        <ListRecords>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Record 1</dc:title>
                <dc:identifier.uri>https://example.com/1</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Record 2</dc:title>
                <dc:identifier.uri>https://example.com/2</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
        </ListRecords>
      </OAI-PMH>
    `
    const result = parseOai(xml, 'uct')
    expect(result.records).toHaveLength(2)
    expect(result.records[0].title).toBe('Record 1')
    expect(result.records[1].title).toBe('Record 2')
  })

  it('should return empty records for short XML', () => {
    expect(parseOai('', 'uct').records).toEqual([])
    expect(parseOai('<short/>', 'uct').records).toEqual([])
  })

  it('should extract resumptionToken', () => {
    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
        <responseDate>2023-01-01T00:00:00Z</responseDate>
        <request verb="ListRecords" metadataPrefix="oai_dc">test</request>
        <ListRecords>
          <record>
            <header>
              <identifier>oai:test:1</identifier>
              <datestamp>2023-01-01</datestamp>
            </header>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Test</dc:title>
              </oai_dc:dc>
            </metadata>
          </record>
          <resumptionToken>token123</resumptionToken>
        </ListRecords>
      </OAI-PMH>
    `
    const result = parseOai(xml, 'uct')
    expect(result.next).toBe('token123')
  })

  it('should parse standalone oai_dc:dc blocks', () => {
    const xml = `
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Standalone Record 1</dc:title>
        <dc:identifier.uri>https://example.com/s1</dc:identifier.uri>
      </oai_dc:dc>
      <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
        <dc:title>Standalone Record 2</dc:title>
        <dc:identifier.uri>https://example.com/s2</dc:identifier.uri>
      </oai_dc:dc>
    `
    const result = parseOai(xml, 'sun')
    expect(result.records).toHaveLength(2)
    expect(result.next).toBeNull()
  })

  it('should filter out records without title', () => {
    const xml = `
      <OAI-PMH>
        <ListRecords>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Valid Record</dc:title>
                <dc:identifier.uri>https://example.com/valid</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:identifier.uri>https://example.com/nontitle</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
        </ListRecords>
      </OAI-PMH>
    `
    const result = parseOai(xml, 'uct')
    expect(result.records).toHaveLength(1)
    expect(result.records[0].title).toBe('Valid Record')
  })

  it('should filter out Untitled records', () => {
    const xml = `
      <OAI-PMH>
        <ListRecords>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Valid Title</dc:title>
                <dc:identifier.uri>https://example.com/valid</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Untitled</dc:title>
                <dc:identifier.uri>https://example.com/untitled</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
        </ListRecords>
      </OAI-PMH>
    `
    const result = parseOai(xml, 'uct')
    expect(result.records).toHaveLength(1)
    expect(result.records[0].title).toBe('Valid Title')
  })

  it('should return empty records for non-OAI XML', () => {
    const xml = `
      <html>
        <body>Not OAI-PMH content</body>
      </html>
    `
    const result = parseOai(xml, 'uct')
    expect(result.records).toEqual([])
  })

  it('should handle multiple creators per record', () => {
    const xml = `
      <OAI-PMH>
        <ListRecords>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>Multi-Author Paper</dc:title>
                <dc:creator>Author One</dc:creator>
                <dc:creator>Author Two</dc:creator>
                <dc:creator>Author Three</dc:creator>
                <dc:identifier.uri>https://example.com/multi</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
        </ListRecords>
      </OAI-PMH>
    `
    const result = parseOai(xml, 'uct')
    expect(result.records).toHaveLength(1)
    expect(result.records[0].authors.length).toBeGreaterThanOrEqual(3)
    expect(result.records[0].authors).toContain('Author One')
    expect(result.records[0].authors).toContain('Author Two')
    expect(result.records[0].authors).toContain('Author Three')
  })

  it('should set correct source for different repositories', () => {
    const createXml = (repoId: string) => `
      <OAI-PMH>
        <ListRecords>
          <record>
            <metadata>
              <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
                <dc:title>${repoId.toUpperCase()} Record</dc:title>
                <dc:identifier.uri>https://example.com/${repoId}</dc:identifier.uri>
              </oai_dc:dc>
            </metadata>
          </record>
        </ListRecords>
      </OAI-PMH>
    `

    expect(parseOai(createXml('uct'), 'uct').records[0].source).toBe('University of Cape Town')
    expect(parseOai(createXml('sun'), 'sun').records[0].source).toBe('Stellenbosch University')
    expect(parseOai(createXml('up'), 'up').records[0].source).toBe('University of Pretoria')
    expect(parseOai(createXml('nwu'), 'nwu').records[0].source).toBe('North-West University')
    expect(parseOai(createXml('wits'), 'wits').records[0].source).toBe('University of Witwatersrand')
  })
})
