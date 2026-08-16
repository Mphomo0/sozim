import { describe, it, expect } from 'vitest'
import {
  getStepWeight,
  getStepSpan,
  STEP_SPAN_CLASSES,
  getPathwayAccent,
} from '@/lib/pathwayLayout'
import type { PathwayStep } from '@/lib/pathwayData'

const shortStep: PathwayStep = {
  title: 'Short step',
  description: 'A brief description.',
}

const mediumStep: PathwayStep = {
  title: 'Medium step',
  description: [
    'This step has a moderate amount of descriptive bullet content that goes into some depth about what the role actually involves day to day.',
    'It spans a couple of bullet points to push the weight solidly into the medium tier without tipping over into the largest bucket.',
  ],
}

const longStepWithRequirements: PathwayStep = {
  title: 'Long step',
  requirements: 'Some non-trivial requirement text for this step.',
  description: [
    'This step has a long list of bullet points describing many responsibilities that a practitioner takes on once they reach this stage of the pathway.',
    'It keeps going with more detail about the role and its expectations, covering the kinds of tasks, environments, and stakeholders involved.',
    'And even more detail here to push total content length well past the large threshold for this particular career step in the pathway description.',
    'One more bullet to be sure this clears the six hundred character mark once joined together with the other bullet point strings listed above it here.',
  ],
}

describe('getStepWeight', () => {
  it('measures a plain string description by its length', () => {
    expect(getStepWeight(shortStep)).toBe(shortStep.description.toString().length)
  })

  it('measures an array description by the joined length', () => {
    const joined = (mediumStep.description as string[]).join(' ')
    expect(getStepWeight(mediumStep)).toBe(joined.length)
  })

  it('adds a fixed bump when requirements is present', () => {
    const withoutReq = getStepWeight({ ...longStepWithRequirements, requirements: undefined })
    const withReq = getStepWeight(longStepWithRequirements)
    expect(withReq - withoutReq).toBe(80)
  })
})

describe('getStepSpan', () => {
  it('returns sm for short content', () => {
    expect(getStepSpan(shortStep)).toBe('sm')
  })

  it('returns md for moderate content', () => {
    expect(getStepSpan(mediumStep)).toBe('md')
  })

  it('returns lg for long content with requirements', () => {
    expect(getStepSpan(longStepWithRequirements)).toBe('lg')
  })

  it('has a Tailwind class entry for every span tier', () => {
    expect(Object.keys(STEP_SPAN_CLASSES).sort()).toEqual(['lg', 'md', 'sm'])
    expect(STEP_SPAN_CLASSES.sm).toBe('')
    expect(STEP_SPAN_CLASSES.md).toContain('row-span-2')
    expect(STEP_SPAN_CLASSES.lg).toContain('col-span-2')
    expect(STEP_SPAN_CLASSES.lg).toContain('row-span-2')
  })
})

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
    const accents = ['assessor', 'facilitator', 'library'].map(getPathwayAccent)
    for (const accent of accents) {
      expect(accent.titleHover).toMatch(/^group-hover:text-\w+-600$/)
      expect(accent.bar).toMatch(/^bg-\w+-600$/)
    }
  })

  it('falls back to the assessor accent for an unknown id', () => {
    expect(getPathwayAccent('unknown-id')).toEqual(getPathwayAccent('assessor'))
  })
})
