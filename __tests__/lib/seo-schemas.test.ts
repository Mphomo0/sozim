// __tests__/lib/seo-schemas.test.ts
import { describe, it, expect } from 'vitest'
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getCourseSchema,
  getArticleSchema,
} from '@/lib/seo/schemas'

describe('getOrganizationSchema', () => {
  it('does not include aggregateRating', () => {
    const schema = getOrganizationSchema()
    expect(schema).not.toHaveProperty('aggregateRating')
  })
})

describe('getLocalBusinessSchema', () => {
  it('does not include aggregateRating', () => {
    const schema = getLocalBusinessSchema()
    expect(schema).not.toHaveProperty('aggregateRating')
  })
})

describe('getCourseSchema', () => {
  it('includes EducationalOccupationalProgram in @type array', () => {
    const schema = getCourseSchema({ name: 'Test', description: 'Test desc' })
    expect(schema['@type']).toContain('EducationalOccupationalProgram')
    expect(schema['@type']).toContain('Course')
  })

  it('includes level when provided', () => {
    const schema = getCourseSchema({ name: 'Test', description: 'Desc', level: 'NQF Level 3' })
    expect(schema.educationalLevel).toBe('NQF Level 3')
  })

  it('includes prerequisites when provided', () => {
    const schema = getCourseSchema({ name: 'Test', description: 'Desc', prerequisites: 'Grade 12' })
    expect(schema.coursePrerequisites).toBe('Grade 12')
  })

  it('includes teaches array when provided', () => {
    const schema = getCourseSchema({ name: 'Test', description: 'Desc', teaches: ['Cataloguing', 'Reference Services'] })
    expect(schema.teaches).toEqual(['Cataloguing', 'Reference Services'])
  })

  it('includes occupationalCategory when provided', () => {
    const schema = getCourseSchema({ name: 'Test', description: 'Desc', occupationalCategory: 'Library and Information Science' })
    expect(schema.occupationalCategory).toBe('Library and Information Science')
  })
})

describe('getArticleSchema', () => {
  it('defaults to Article type', () => {
    const schema = getArticleSchema({
      headline: 'Test', description: 'Desc',
      datePublished: '2026-01-01', dateModified: '2026-01-01',
    })
    expect(schema['@type']).toBe('Article')
  })

  it('uses NewsArticle when type is NewsArticle', () => {
    const schema = getArticleSchema({
      headline: 'Test', description: 'Desc',
      datePublished: '2026-01-01', dateModified: '2026-01-01',
      type: 'NewsArticle',
    })
    expect(schema['@type']).toBe('NewsArticle')
  })

  it('includes articleSection when provided', () => {
    const schema = getArticleSchema({
      headline: 'Test', description: 'Desc',
      datePublished: '2026-01-01', dateModified: '2026-01-01',
      articleSection: 'Education News',
    })
    expect(schema.articleSection).toBe('Education News')
  })
})
