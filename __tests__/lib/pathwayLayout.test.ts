import { describe, it, expect } from 'vitest'
import { getPathwayAccent } from '@/lib/pathwayLayout'

describe('getPathwayAccent', () => {
  it('returns the assessor accent for id "assessor"', () => {
    const accent = getPathwayAccent('assessor')
    expect(accent.iconText).toContain('blue')
    expect(accent.titleHover).toBe('group-hover:text-blue-600')
    expect(accent.bar).toBe('bg-blue-600')
  })

  it('returns the facilitator accent for id "facilitator"', () => {
    const accent = getPathwayAccent('facilitator')
    expect(accent.iconText).toContain('indigo')
    expect(accent.titleHover).toBe('group-hover:text-indigo-600')
    expect(accent.bar).toBe('bg-indigo-600')
  })

  it('returns the library accent for id "library"', () => {
    const accent = getPathwayAccent('library')
    expect(accent.iconText).toContain('emerald')
    expect(accent.titleHover).toBe('group-hover:text-emerald-600')
    expect(accent.bar).toBe('bg-emerald-600')
  })

  it('has complete literal titleHover and bar classes for every accent (Tailwind JIT requires literal strings)', () => {
    const accents = ['assessor', 'facilitator', 'library', 'career-info-officer'].map(getPathwayAccent)
    for (const accent of accents) {
      expect(accent.titleHover).toMatch(/^group-hover:text-\w+-600$/)
      expect(accent.bar).toMatch(/^bg-\w+-600$/)
    }
  })

  it('falls back to the assessor accent for an unknown id', () => {
    expect(getPathwayAccent('unknown-id')).toEqual(getPathwayAccent('assessor'))
  })
})
