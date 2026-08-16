import type { PathwayStep } from './pathwayData'

/**
 * Rough content weight for a pathway step, used only to pick a bento grid
 * span tier. Not a measure of anything semantic — just character count of
 * the flattened description plus a fixed bump when requirements text is
 * present, since that renders as extra content in the card too.
 */
export function getStepWeight(step: PathwayStep): number {
  const descriptionText = Array.isArray(step.description)
    ? step.description.join(' ')
    : step.description
  const requirementsBump = step.requirements ? 80 : 0
  return descriptionText.length + requirementsBump
}

export type StepSpan = 'sm' | 'md' | 'lg'

const LARGE_WEIGHT_THRESHOLD = 600
const MEDIUM_WEIGHT_THRESHOLD = 250

export function getStepSpan(step: PathwayStep): StepSpan {
  const weight = getStepWeight(step)
  if (weight >= LARGE_WEIGHT_THRESHOLD) return 'lg'
  if (weight >= MEDIUM_WEIGHT_THRESHOLD) return 'md'
  return 'sm'
}

export const STEP_SPAN_CLASSES: Record<StepSpan, string> = {
  sm: '',
  md: 'md:row-span-2',
  lg: 'md:col-span-2 md:row-span-2',
}

export type PathwayAccent = {
  border: string
  badgeBg: string
  badgeText: string
  activeTabText: string
  iconBg: string
  iconText: string
  titleHover: string
  bar: string
}

const PATHWAY_ACCENTS: Record<string, PathwayAccent> = {
  assessor: {
    border: 'border-blue-200',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    activeTabText: 'data-[state=active]:text-blue-700',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
    titleHover: 'group-hover:text-blue-600',
    bar: 'bg-blue-600',
  },
  facilitator: {
    border: 'border-indigo-200',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    activeTabText: 'data-[state=active]:text-indigo-700',
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-600',
    titleHover: 'group-hover:text-indigo-600',
    bar: 'bg-indigo-600',
  },
  library: {
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    activeTabText: 'data-[state=active]:text-emerald-700',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    titleHover: 'group-hover:text-emerald-600',
    bar: 'bg-emerald-600',
  },
}

export function getPathwayAccent(pathwayId: string): PathwayAccent {
  return PATHWAY_ACCENTS[pathwayId] ?? PATHWAY_ACCENTS.assessor
}
