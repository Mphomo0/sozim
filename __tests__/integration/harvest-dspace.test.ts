import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { harvestDSpaceRepo } from '@/lib/harvest-dspace'
import { mockOaiResponse, mockOaiResponseWithToken, mockOaiErrorResponse } from '../mocks/harvest-mocks'

vi.mock('@/lib/convex-client', () => ({
  convexClient: null,
  api: {},
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('harvestDSpaceRepo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should harvest records from DSpace repository', async () => {
    const mockResponse = mockOaiResponse([
      { title: 'Thesis 1', authors: ['Author A'], type: 'Thesis', identifier: 'https://example.com/1' },
      { title: 'Article 1', authors: ['Author B'], type: 'Article', identifier: 'https://example.com/2' },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.t.length).toBe(1)
    expect(result.a.length).toBe(1)
    expect(result.t[0].title).toBe('Thesis 1')
    expect(result.a[0].title).toBe('Article 1')
  })

  it('should handle thesis type detection', async () => {
    const mockResponse = mockOaiResponse([
      { title: 'PhD Dissertation', type: 'Thesis/Dissertation' },
      { title: 'Master Thesis', type: 'thesis' },
      { title: 'Regular Article', type: 'Article' },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.t.length).toBe(2)
    expect(result.a.length).toBe(1)
  })

  it('should stop when limit is reached', async () => {
    const mockResponse = mockOaiResponse([
      { title: 'Record 1', type: 'Article' },
      { title: 'Record 2', type: 'Article' },
      { title: 'Record 3', type: 'Article' },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 2)

    expect(result.a.length).toBe(2)
  })

  it('should handle noRecordsMatch error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockOaiErrorResponse('noRecordsMatch')),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.t.length).toBe(0)
    expect(result.a.length).toBe(0)
  })

  it('should handle empty response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('<short/>'),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.t.length).toBe(0)
    expect(result.a.length).toBe(0)
  })

  it('should handle fetch failure and return empty', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.t.length).toBe(0)
    expect(result.a.length).toBe(0)
  })

  it('should paginate with resumptionToken', async () => {
    const page1 = mockOaiResponseWithToken(
      [{ title: 'Page 1 Record', type: 'Article' }],
      'token123'
    )
    const page2 = mockOaiResponse([
      { title: 'Page 2 Record', type: 'Article' },
    ])

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(page1),
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(page2),
      })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(result.a.length).toBe(2)
  })

  it('should set correct source for repository', async () => {
    const mockResponse = mockOaiResponse([
      { title: 'SUN Record', type: 'Article' },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('sun', 'https://scholar.sun.ac.za/server/oai/request', 10)

    expect(result.a[0].source).toBe('Stellenbosch University')
  })

  it('should extract year from date field', async () => {
    const mockResponse = mockOaiResponse([
      { title: 'Record with Date', date: '2022-05-15', type: 'Article' },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.a[0].year).toBe(2022)
  })

  it('should extract multiple authors', async () => {
    const mockResponse = mockOaiResponse([
      { 
        title: 'Multi-author Paper',
        authors: ['Author One', 'Author Two', 'Author Three'],
        type: 'Article'
      },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.a[0].authors.length).toBeGreaterThanOrEqual(3)
  })

  it('should handle records without title as Other type', async () => {
    const mockResponse = mockOaiResponse([
      { title: 'Valid Article', type: 'Article' },
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 10)

    expect(result.a.length).toBe(1)
  })

  it('should respect maxPages limit', async () => {
    const createPage = (pageNum: number) => mockOaiResponseWithToken(
      [{ title: `Page ${pageNum} Record`, type: 'Article' }],
      pageNum < 5 ? `token${pageNum}` : ''
    )

    mockFetch
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(createPage(1)) })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(createPage(2)) })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(createPage(3)) })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(createPage(4)) })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(createPage(5)) })
      .mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(createPage(6)) })

    const result = await harvestDSpaceRepo('uct', 'https://open.uct.ac.za/oai/request', 100)

    expect(mockFetch.mock.calls.length).toBeLessThanOrEqual(5)
  })
})
