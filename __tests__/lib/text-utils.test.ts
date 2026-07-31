import { describe, it, expect } from 'vitest'
import { detectSmallTalk } from '@/lib/text-utils'

describe('detectSmallTalk', () => {
  it('classifies a bare "Hi" as a greeting', () => {
    expect(detectSmallTalk('Hi')).toBe('greeting')
  })

  it('classifies "Hello" as a greeting', () => {
    expect(detectSmallTalk('Hello')).toBe('greeting')
  })

  it('ignores case and trailing punctuation', () => {
    expect(detectSmallTalk('HELLO!')).toBe('greeting')
    expect(detectSmallTalk('hi...')).toBe('greeting')
  })

  it('classifies multi-word greetings', () => {
    expect(detectSmallTalk('Hi there')).toBe('greeting')
    expect(detectSmallTalk('Good morning')).toBe('greeting')
  })

  it('classifies South African greetings', () => {
    expect(detectSmallTalk('Howzit')).toBe('greeting')
    expect(detectSmallTalk('Dumela')).toBe('greeting')
  })

  it('classifies thanks separately from greetings', () => {
    expect(detectSmallTalk('Thanks')).toBe('thanks')
    expect(detectSmallTalk('thank you so much')).toBe('thanks')
  })

  it('returns null for a real question so retrieval still runs', () => {
    expect(detectSmallTalk('What courses do you offer?')).toBeNull()
    expect(detectSmallTalk('How much is the Library Assistant course?')).toBeNull()
  })

  it('returns null when a greeting is followed by a real question', () => {
    expect(detectSmallTalk('Hi, how much are your fees?')).toBeNull()
    expect(detectSmallTalk('Hello, do you offer online learning?')).toBeNull()
  })

  it('returns null for empty input', () => {
    expect(detectSmallTalk('')).toBeNull()
    expect(detectSmallTalk('   ')).toBeNull()
  })
})
