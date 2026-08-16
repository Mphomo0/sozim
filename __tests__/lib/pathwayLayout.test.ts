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
    'This step has a moderate amount of descriptive bullet content.',
    'It spans a couple of bullet points to push the weight up.',
  ],
}

const longStepWithRequirements: PathwayStep = {
  title: 'Long step',
  requirements: 'Some non-trivial requirement text for this step.',
  description: [
    'This step has a long list of bullet points describing many responsibilities.',
    'It keeps going with more detail about the role and its expectations.',
    'And even more detail here to push total content length well past the large threshold for this particular career step in the pathway.',
    'One more bullet to be sure this clears six hundred characters once joined together with the other bullet point strings above it.',
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
    expect(getPathwayAccent('assessor').iconText).toContain('blue')
  })

  it('returns the facilitator accent for id "facilitator"', () => {
    expect(getPathwayAccent('facilitator').iconText).toContain('indigo')
  })

  it('returns the library accent for id "library"', () => {
    expect(getPathwayAccent('library').iconText).toContain('emerald')
  })

  it('falls back to the assessor accent for an unknown id', () => {
    expect(getPathwayAccent('unknown-id')).toEqual(getPathwayAccent('assessor'))
  })
})
