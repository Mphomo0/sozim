export const mockOaiResponse = (records: Array<{
  title: string
  authors?: string[]
  type?: string
  date?: string
  identifier?: string
  subjects?: string[]
  description?: string
}>): string => {
  const recordXml = records.map((r, index) => `
    <record>
      <header>
        <identifier>oai:uct:${index + 1}</identifier>
        <datestamp>2023-01-01</datestamp>
      </header>
      <metadata>
        <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
          <dc:title>${r.title}</dc:title>
          ${(r.authors || ['Unknown Author']).map(a => `<dc:creator>${a}</dc:creator>`).join('\n          ')}
          <dc:date>${r.date || '2023'}</dc:date>
          <dc:type>${r.type || 'Article'}</dc:type>
          <dc:identifier.uri>${r.identifier || `https://example.com/record/${index + 1}`}</dc:identifier.uri>
          ${(r.subjects || []).map(s => `<dc:subject>${s}</dc:subject>`).join('\n          ')}
          ${r.description ? `<dc:description>${r.description}</dc:description>` : ''}
        </oai_dc:dc>
      </metadata>
    </record>
  `).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <responseDate>2023-01-01T00:00:00Z</responseDate>
  <request verb="ListRecords" metadataPrefix="oai_dc">https://open.uct.ac.za/oai/request</request>
  <ListRecords>
    ${recordXml}
  </ListRecords>
</OAI-PMH>`
}

export const mockOaiResponseWithToken = (
  records: Array<{
    title: string
    authors?: string[]
    type?: string
    date?: string
    identifier?: string
    subjects?: string[]
    description?: string
  }>,
  token: string
): string => {
  const base = mockOaiResponse(records)
  return base.replace('</ListRecords>', `
    <resumptionToken>${token}</resumptionToken>
  </ListRecords>`)
}

export const mockOaiErrorResponse = (code: string, message?: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <error code="${code}">${message || ''}</error>
</OAI-PMH>`
}

export const mockDryadResponse = (datasets: Array<{
  id: string | number
  doi?: string
  title: string
  authors?: Array<{ fullName?: string; firstName?: string; lastName?: string }>
  abstract?: string
  keywords?: string[]
  publicationDate?: string
}>): string => JSON.stringify({
  _embedded: {
    'stash:datasets': datasets.map(d => ({
      id: d.id,
      attributes: {
        doi: d.doi,
        title: d.title,
        authors: d.authors,
        abstract: d.abstract,
        keywords: d.keywords,
        publicationDate: d.publicationDate,
      },
    })),
  },
})

export const mockZenodoResponse = (records: Array<{
  id: string | number
  doi?: string
  title: string
  creators?: Array<{ name: string }>
  description?: string
  keywords?: string[]
  publication_date?: string
}>): string => JSON.stringify({
  hits: {
    hits: records.map(r => ({
      id: r.id,
      metadata: {
        doi: r.doi,
        title: r.title,
        creators: r.creators,
        description: r.description,
        keywords: r.keywords,
        publication_date: r.publication_date,
      },
      links: {
        html: `https://zenodo.org/record/${r.id}`,
      },
    })),
  },
})

export const mockMendeleyResponse = (
  items: Array<{
    id: string
    title?: string
    doi?: string
    titles?: Array<{ title: string }>
    creators?: Array<{ name?: string; familyName?: string }>
    descriptions?: Array<{ description: string }>
    subjects?: Array<{ subject: string }>
    publicationYear?: number
  }>,
  totalPages?: number
): string => JSON.stringify({
  data: items.map(item => ({
    id: item.id,
    attributes: {
      title: item.title,
      titles: item.titles,
      doi: item.doi,
      creators: item.creators,
      descriptions: item.descriptions,
      subjects: item.subjects,
      publicationYear: item.publicationYear,
    },
  })),
  meta: {
    totalPages,
  },
})
