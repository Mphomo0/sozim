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
  'career-info-officer': {
    border: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    activeTabText: 'data-[state=active]:text-amber-700',
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-600',
    titleHover: 'group-hover:text-amber-600',
    bar: 'bg-amber-600',
  },
}

export function getPathwayAccent(pathwayId: string): PathwayAccent {
  return PATHWAY_ACCENTS[pathwayId] ?? PATHWAY_ACCENTS.assessor
}
