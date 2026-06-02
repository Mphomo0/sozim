import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchResearchSource } from '@/lib/harvest-research'
import { RESEARCH_DATA_SOURCES } from '@/lib/harvest-utils'
import {
  mockDryadResponse,
  mockZenodoResponse,
  mockMendeleyResponse,
} from '../mocks/harvest-mocks'

vi.mock('@/lib/convex-client', () => ({
  convexClient: null,
  api: {},
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('fetchResearchSource', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Dryad', () => {
    it('should fetch and parse Dryad datasets', async () => {
      const mockResponse = mockDryadResponse([
        {
          id: '123',
          doi: '10.5061/dryad.abc123',
          title: 'Dataset A',
          authors: [{ fullName: 'John Doe' }],
          abstract: 'Abstract text',
          keywords: ['keyword1', 'keyword2'],
          publicationDate: '2023-01-15',
        },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const dryadSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'dryad')!
      const result = await fetchResearchSource(dryadSource, '', 10)

      expect(result.length).toBe(1)
      expect(result[0].title).toBe('Dataset A')
      expect(result[0].source).toBe('Dryad Digital Repository')
      expect(result[0].type).toBe('Research Data')
      expect(result[0].identifier).toBe('10.5061/dryad.abc123')
      expect(result[0].identifierType).toBe('DOI')
    })

    it('should handle empty Dryad response', async () => {
      const mockResponse = mockDryadResponse([])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const dryadSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'dryad')!
      const result = await fetchResearchSource(dryadSource, '', 10)

      expect(result.length).toBe(0)
    })

    it('should extract authors from different name formats', async () => {
      const mockResponse = mockDryadResponse([
        {
          id: '456',
          title: 'Multi-author Dataset',
          authors: [
            { fullName: 'Jane Smith' },
            { firstName: 'Bob', lastName: 'Johnson' },
          ],
        },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const dryadSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'dryad')!
      const result = await fetchResearchSource(dryadSource, '', 10)

      expect(result[0].authors.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Zenodo', () => {
    it('should fetch and parse Zenodo records', async () => {
      const mockResponse = mockZenodoResponse([
        {
          id: '789',
          doi: '10.5281/zenodo.123456',
          title: 'Zenodo Dataset',
          creators: [{ name: 'Alice Wonder' }],
          description: 'A dataset description',
          keywords: ['data', 'research'],
          publication_date: '2023-06-20',
        },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const zenodoSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'zenodo')!
      const result = await fetchResearchSource(zenodoSource, '', 10)

      expect(result.length).toBe(1)
      expect(result[0].title).toBe('Zenodo Dataset')
      expect(result[0].source).toBe('Zenodo')
      expect(result[0].year).toBe(2023)
    })

    it('should use html link when no DOI', async () => {
      const mockResponse = mockZenodoResponse([
        {
          id: '999',
          title: 'Dataset without DOI',
          creators: [],
        },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const zenodoSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'zenodo')!
      const result = await fetchResearchSource(zenodoSource, '', 10)

      expect(result[0].url).toContain('zenodo.org')
    })

    it('should stop when hits are less than page size', async () => {
      const mockResponse = mockZenodoResponse([
        { id: '1', title: 'Dataset 1' },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const zenodoSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'zenodo')!
      const result = await fetchResearchSource(zenodoSource, '', 25)

      expect(result.length).toBe(1)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })

  describe('Mendeley', () => {
    it('should fetch and parse Mendeley datasets', async () => {
      const mockResponse = mockMendeleyResponse([
        {
          id: 'uuid-123',
          title: 'Mendeley Dataset',
          doi: '10.17632/xyz.abc',
          creators: [{ name: 'Researcher One' }],
          descriptions: [{ description: 'Description text' }],
          subjects: [{ subject: 'Biology' }],
          publicationYear: 2022,
        },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const mendeleySource = RESEARCH_DATA_SOURCES.find(s => s.name === 'mendeley')!
      const result = await fetchResearchSource(mendeleySource, '', 10)

      expect(result.length).toBe(1)
      expect(result[0].title).toBe('Mendeley Dataset')
      expect(result[0].source).toBe('Mendeley Data')
      expect(result[0].year).toBe(2022)
    })

    it('should respect totalPages from meta', async () => {
      const mockResponse = mockMendeleyResponse(
        [{ id: 'page1-1', title: 'Page 1 Record' }],
        1
      )

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const mendeleySource = RESEARCH_DATA_SOURCES.find(s => s.name === 'mendeley')!
      const result = await fetchResearchSource(mendeleySource, '', 10)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(result.length).toBe(1)
    })

    it('should extract title from nested titles array', async () => {
      const mockResponse = mockMendeleyResponse([
        {
          id: 'uuid-456',
          titles: [{ title: 'Actual Title' }],
        },
      ])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const mendeleySource = RESEARCH_DATA_SOURCES.find(s => s.name === 'mendeley')!
      const result = await fetchResearchSource(mendeleySource, '', 10)

      expect(result[0].title).toBe('Actual Title')
    })
  })

  describe('Error handling', () => {
    it('should return empty array on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const dryadSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'dryad')!
      const result = await fetchResearchSource(dryadSource, '', 10)

      expect(result.length).toBe(0)
    })

    it('should return empty array on invalid JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('not valid json'),
      })

      const zenodoSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'zenodo')!
      const result = await fetchResearchSource(zenodoSource, '', 10)

      expect(result.length).toBe(0)
    })

    it('should return empty array on HTML response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<html><body>Error</body></html>'),
      })

      const zenodoSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'zenodo')!
      const result = await fetchResearchSource(zenodoSource, '', 10)

      expect(result.length).toBe(0)
    })
  })

  describe('Limit handling', () => {
    it('should respect limit parameter', async () => {
      const manyRecords = Array.from({ length: 30 }, (_, i) => ({
        id: String(i + 1),
        doi: `10.5061/dryad.${i}`,
        title: `Dataset ${i}`,
        authors: [{ fullName: `Author ${i}` }],
      }))

      const mockResponse = mockDryadResponse(manyRecords)

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const dryadSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'dryad')!
      const result = await fetchResearchSource(dryadSource, '', 5)

      expect(result.length).toBeLessThanOrEqual(5)
    })
  })

  describe('Query parameter', () => {
    it('should include query in URL', async () => {
      const mockResponse = mockDryadResponse([])

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(mockResponse),
      })

      const dryadSource = RESEARCH_DATA_SOURCES.find(s => s.name === 'dryad')!
      await fetchResearchSource(dryadSource, 'climate change', 10)

      const fetchCall = mockFetch.mock.calls[0][0] as string
      expect(fetchCall).toContain('climate%20change')
    })
  })
})
