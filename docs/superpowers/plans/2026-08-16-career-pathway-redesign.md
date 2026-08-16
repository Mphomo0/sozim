# Career Pathways Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the visual layout of `/career-pathway` (the `CareerPathwayComp` component) into a modern, responsive bento-grid design, without changing any rendered text.

**Architecture:** Two new small pure helper functions in `lib/pathwayLayout.ts` compute a bento grid-span tier and a per-pathway accent-color set from the existing `lib/pathwayData.ts` shape. `CareerPathwayComp.tsx` is then restyled in place — pathway switcher, summary tile, step grid, registration section — consuming those helpers. No changes to `lib/pathwayData.ts` types or content, and no changes to `app/career-pathway/page.tsx`.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS v4, shadcn/ui (`Card`, `Tabs`, `Badge`, `Select`), `motion/react`, Vitest for unit tests.

## Global Constraints

- No text content changes anywhere. Every string currently rendered from `lib/pathwayData.ts` (pathway titles, descriptions, step titles, `requirements`, step `description` entries, `registration` items) must appear unchanged and in full in the redesigned component.
- `lib/pathwayData.ts` types (`PathwayStep`, `CareerPathway`) and content are not modified.
- `app/career-pathway/page.tsx` is not modified.
- Keep the existing blue/indigo/emerald palette — no new brand colors.
- Keep `motion/react` for animation (retune transitions only if needed, don't swap libraries).
- Pathway switcher stays tabs (desktop) / `<Select>` (mobile) — restyle only, same `Tabs`/`Select` components and the same `tabValue` state + scroll-to-top `useEffect`.

---

### Task 1: Bento layout + accent-color helpers

**Files:**
- Create: `lib/pathwayLayout.ts`
- Test: `__tests__/lib/pathwayLayout.test.ts`

**Interfaces:**
- Consumes: `PathwayStep`, `CareerPathway` types from `lib/pathwayData.ts` (already defined, unchanged).
- Produces:
  - `getStepWeight(step: PathwayStep): number`
  - `getStepSpan(step: PathwayStep): 'sm' | 'md' | 'lg'`
  - `STEP_SPAN_CLASSES: Record<'sm' | 'md' | 'lg', string>`
  - `type PathwayAccent = { border: string; badgeBg: string; badgeText: string; activeTabText: string; iconBg: string; iconText: string }`
  - `getPathwayAccent(pathwayId: string): PathwayAccent`

  Task 2/3/4 import these five names from `@/lib/pathwayLayout`.

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/pathwayLayout.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run __tests__/lib/pathwayLayout.test.ts`
Expected: FAIL — `lib/pathwayLayout.ts` does not exist yet (module not found).

- [ ] **Step 3: Implement `lib/pathwayLayout.ts`**

```typescript
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
}

const PATHWAY_ACCENTS: Record<string, PathwayAccent> = {
  assessor: {
    border: 'border-blue-200',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    activeTabText: 'data-[state=active]:text-blue-700',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-600',
  },
  facilitator: {
    border: 'border-indigo-200',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    activeTabText: 'data-[state=active]:text-indigo-700',
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-600',
  },
  library: {
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    activeTabText: 'data-[state=active]:text-emerald-700',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-600',
  },
}

export function getPathwayAccent(pathwayId: string): PathwayAccent {
  return PATHWAY_ACCENTS[pathwayId] ?? PATHWAY_ACCENTS.assessor
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run __tests__/lib/pathwayLayout.test.ts`
Expected: PASS (13 tests).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/pathwayLayout.ts __tests__/lib/pathwayLayout.test.ts
git commit -m "feat: add bento span and pathway accent helpers for career pathways redesign"
```

---

### Task 2: Restyle pathway switcher and summary tile

**Files:**
- Modify: `components/sections/careerpathways/CareerPathwayComp.tsx`

**Interfaces:**
- Consumes: `getPathwayAccent` from `@/lib/pathwayLayout` (Task 1).
- Produces: no new exports — internal restyle of `PathwayDetail`'s summary card and the main component's tab/select switcher. Task 3 will edit the same file's step-grid section next; the summary-card JSX block this task produces must stay intact (don't restructure it further in Task 3).

This task only touches the **switcher** (mobile `<Select>` + desktop `<Tabs>`) and the **summary card** at the top of `PathwayDetail`. It does not touch the step grid or registration section (Task 3 and Task 4).

- [ ] **Step 1: Import the accent helper**

In `components/sections/careerpathways/CareerPathwayComp.tsx`, add to the existing import block (near the `pathwayData` import):

```typescript
import { getPathwayAccent } from '@/lib/pathwayLayout'
```

- [ ] **Step 2: Restyle the summary card to use the pathway's accent**

The summary `<Card>` inside `PathwayDetail` currently hardcodes blue for every pathway (`bg-blue-600` left bar, `bg-blue-50 text-blue-600` icon well, `bg-blue-50/50` hover gradient, `bg-blue-100 text-blue-800` NQF badge). Replace it so those come from the pathway's accent instead. Find this block:

```tsx
        <Card className="relative overflow-hidden border-slate-200/60 transition-all duration-500 shadow-xl group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="p-4 md:p-8 lg:p-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                  {iconMap[pathway.id]}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    {pathway.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-3">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-1 rounded-full font-bold shadow-sm">
                      <Zap className="w-3.5 h-3.5 mr-1.5" /> NQF LEVEL {pathway.n_q_f_level}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600 border-slate-300 px-4 py-1 rounded-full font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1.5" /> {pathway.credits} CREDITS
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base md:text-xl font-light text-slate-600 leading-relaxed max-w-4xl italic">
              "{pathway.description}"
            </p>
          </CardContent>
        </Card>
```

Replace with (introduces a local `accent` variable read from the new helper, keeps every piece of text — `pathway.title`, `pathway.n_q_f_level`, `pathway.credits`, `pathway.description` — exactly as before):

```tsx
        <Card className={`relative overflow-hidden border ${accent.border} transition-all duration-500 shadow-lg group`}>
          <div className={`absolute top-0 left-0 w-1.5 h-full ${accent.iconText.replace('text-', 'bg-')}`} />

          <CardContent className="p-6 md:p-10 lg:p-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className={`flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-2xl ${accent.iconBg} ${accent.iconText} shadow-sm border ${accent.border}`}>
                  {iconMap[pathway.id]}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    {pathway.title}
                  </h2>
                  <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-3">
                    <Badge className={`${accent.badgeBg} ${accent.badgeText} px-4 py-1 rounded-full font-bold shadow-sm`}>
                      <Zap className="w-3.5 h-3.5 mr-1.5" /> NQF LEVEL {pathway.n_q_f_level}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600 border-slate-300 px-4 py-1 rounded-full font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1.5" /> {pathway.credits} CREDITS
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base md:text-xl font-light text-slate-600 leading-relaxed max-w-4xl italic">
              "{pathway.description}"
            </p>
          </CardContent>
        </Card>
```

Note the removed hover-gradient `<div>` — it was a purely decorative blue wash that doesn't fit a per-pathway accent cleanly; dropping it simplifies the card. This is a style simplification, not a content change.

- [ ] **Step 3: Compute `accent` inside `PathwayDetail`**

Find the start of `PathwayDetail`:

```tsx
const PathwayDetail = ({ pathway }: { pathway: CareerPathway }) => {
  return (
```

Replace with:

```tsx
const PathwayDetail = ({ pathway }: { pathway: CareerPathway }) => {
  const accent = getPathwayAccent(pathway.id)
  return (
```

- [ ] **Step 4: Restyle the desktop tab list to use per-tab accents**

Find:

```tsx
                {careerPathways.map((pathway) => (
                  <TabsTrigger
                    key={pathway.id}
                    value={pathway.id}
                    className="
                      flex-1 py-4 px-6 font-bold transition-all duration-300 rounded-xl
                      flex items-center justify-center gap-3
                      data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-lg
                      data-[state=active]:ring-1 data-[state=active]:ring-slate-100
                      text-slate-500 hover:text-slate-800 hover:bg-slate-100/50
                    "
                  >
                    {iconMap[pathway.id]}
                    {pathway.title.split('(')[0].trim()}
                  </TabsTrigger>
                ))}
```

Replace with (each trigger now colors its own active state from that pathway's accent, instead of every tab using blue):

```tsx
                {careerPathways.map((pathway) => {
                  const tabAccent = getPathwayAccent(pathway.id)
                  return (
                    <TabsTrigger
                      key={pathway.id}
                      value={pathway.id}
                      className={`
                        flex-1 py-4 px-6 font-bold transition-all duration-300 rounded-xl
                        flex items-center justify-center gap-3
                        data-[state=active]:bg-white ${tabAccent.activeTabText} data-[state=active]:shadow-md
                        data-[state=active]:ring-1 data-[state=active]:ring-slate-100
                        text-slate-500 hover:text-slate-800 hover:bg-slate-100/50
                      `}
                    >
                      {iconMap[pathway.id]}
                      {pathway.title.split('(')[0].trim()}
                    </TabsTrigger>
                  )
                })}
```

Also simplify the wrapping tab bar container — find:

```tsx
          <div className="hidden md:block sticky top-24 z-30 mb-12">
            <div className="flex justify-center bg-white/70 backdrop-blur-xl p-2 rounded-[28px] shadow-2xl border border-white/50 max-w-4xl mx-auto">
```

Replace with (drops the glass/blur treatment per the design's "simpler pill shapes, no backdrop-blur" direction):

```tsx
          <div className="hidden md:block sticky top-24 z-30 mb-12">
            <div className="flex justify-center bg-white p-2 rounded-2xl shadow-lg border border-slate-100 max-w-4xl mx-auto">
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual visual check (partial — grid/registration not yet restyled, that's expected)**

Start the dev server (`npm run dev`), open `/career-pathway`. Confirm:
- Switching tabs (desktop) and the mobile `<Select>` still work.
- The summary card now shows blue for Assessor, indigo for Facilitator, emerald for Library.
- All summary text (title, NQF level, credits, italic description) is unchanged from before this task.

- [ ] **Step 7: Commit**

```bash
git add components/sections/careerpathways/CareerPathwayComp.tsx
git commit -m "style: apply per-pathway accent to summary card and tab switcher"
```

---

### Task 3: Rebuild the step grid as an asymmetric bento layout

**Files:**
- Modify: `components/sections/careerpathways/CareerPathwayComp.tsx`

**Interfaces:**
- Consumes: `getStepSpan`, `STEP_SPAN_CLASSES` from `@/lib/pathwayLayout` (Task 1); `accent` variable already computed in `PathwayDetail` (Task 2).
- Produces: no new exports — restyles only the "Career Progression Section" block (the `pathway.steps.map(...)` grid) inside `PathwayDetail`. Does not touch the summary card (Task 2) or the registration section (Task 4).

- [ ] **Step 1: Import the span helpers**

Extend the import added in Task 2:

```typescript
import { getPathwayAccent, getStepSpan, STEP_SPAN_CLASSES } from '@/lib/pathwayLayout'
```

- [ ] **Step 2: Replace the equal-column step grid with the bento grid**

Find the "Career Progression Section":

```tsx
      {/* Career Progression Section */}
        <div className="space-y-8">
        <div className="flex items-center gap-3 md:gap-4">
          <h3 className="text-xl md:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Career Progression
          </h3>
          <div className="h-1 flex-1 bg-slate-100 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {pathway.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-slate-200/60 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="pb-4">
                   <div className="flex items-center justify-between mb-4">
                     <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold shadow-lg">
                       {index + 1}
                     </span>
                     {step.n_q_f_level && (
                       <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-3 py-1 rounded-full font-bold">
                         NQF {step.n_q_f_level}
                       </Badge>
                     )}
                   </div>
                   <CardTitle className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                     {step.title}
                   </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {step.requirements && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" /> REQUIREMENTS
                      </p>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        {step.requirements}
                      </p>
                    </div>
                  )}

                  <div className="text-sm font-medium text-slate-600 leading-relaxed pl-1">
                    {Array.isArray(step.description) ? (
                      <ul className="space-y-3">
                        {step.description.map((item, idx) => (
                          <li key={idx} className="flex gap-3 items-start">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-blue-400 shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: item }} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p dangerouslySetInnerHTML={{ __html: step.description }} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
```

Replace with (grid becomes `md:grid-flow-dense` with per-step span classes computed from content weight; every rendered text node — `step.title`, `step.n_q_f_level`, `step.requirements`, `step.description` items — is preserved verbatim, only the surrounding structure/classNames change):

```tsx
      {/* Career Progression Section */}
        <div className="space-y-8">
        <div className="flex items-center gap-3 md:gap-4">
          <h3 className="text-xl md:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Career Progression
          </h3>
          <div className="h-1 flex-1 bg-slate-100 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-flow-dense gap-6 md:gap-8">
          {pathway.steps.map((step, index) => {
            const span = getStepSpan(step)
            return (
              <motion.div
                key={index}
                className={STEP_SPAN_CLASSES[span]}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className={`h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border-slate-200/60 overflow-hidden relative`}>
                  <div className={`absolute top-0 left-0 w-full h-1 ${accent.iconText.replace('text-', 'bg-')} opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />

                  <CardHeader className="pb-4">
                     <div className="flex items-center justify-between mb-4">
                       <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold shadow-md">
                         {index + 1}
                       </span>
                       {step.n_q_f_level && (
                         <Badge className={`${accent.badgeBg} ${accent.badgeText} px-3 py-1 rounded-full font-bold`}>
                           NQF {step.n_q_f_level}
                         </Badge>
                       )}
                     </div>
                     <CardTitle className={`text-xl font-bold tracking-tight text-slate-900 group-hover:${accent.iconText} transition-colors`}>
                       {step.title}
                     </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {step.requirements && (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                          <CheckCircle className={`w-4 h-4 ${accent.iconText}`} /> REQUIREMENTS
                        </p>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed">
                          {step.requirements}
                        </p>
                      </div>
                    )}

                    <div className="text-sm font-medium text-slate-600 leading-relaxed pl-1">
                      {Array.isArray(step.description) ? (
                        <ul className="space-y-3">
                          {step.description.map((item, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                              <ChevronRight className={`w-4 h-4 mt-0.5 ${accent.iconText} shrink-0`} />
                              <span dangerouslySetInnerHTML={{ __html: item }} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p dangerouslySetInnerHTML={{ __html: step.description }} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
```

Note: `group-hover:${accent.iconText}` (a template-literal-built class) works here because Tailwind v4's JIT scans the final built strings in `PATHWAY_ACCENTS` (`lib/pathwayLayout.ts`) directly as source — the class names are complete static strings there (e.g. `'text-blue-600'`), just referenced via a variable at usage sites. This mirrors what Task 2 already does for the icon well and badges.

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: PASS (existing 154 tests + 13 new from Task 1 = 167 passing, 0 failing).

- [ ] **Step 5: Manual visual check across breakpoints**

Start the dev server if not already running (`npm run dev`). Using the browser tool, for each of the three tabs (Assessor, Facilitator, Library):
- At a desktop width (~1280px): confirm the step grid shows a visibly asymmetric layout (some cards wider/taller than others), not a uniform 3-column grid.
- At a mobile width (~375px): confirm the grid collapses to a single column with all steps in original order.
- Confirm every step's title, requirements (where present), and full description text is visible and matches `lib/pathwayData.ts` — nothing truncated or dropped.

- [ ] **Step 6: Commit**

```bash
git add components/sections/careerpathways/CareerPathwayComp.tsx
git commit -m "feat: rebuild career pathway step grid as an asymmetric bento layout"
```

---

### Task 4: Restyle registration section, final polish pass, full verification

**Files:**
- Modify: `components/sections/careerpathways/CareerPathwayComp.tsx`

**Interfaces:**
- Consumes: `accent` variable from `PathwayDetail` (Task 2).
- Produces: nothing new — this is the last visual task, closing out the component redesign.

- [ ] **Step 1: Restyle the registration badges section**

Find:

```tsx
      {/* Registration Section */}
      {pathway.registration && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-xl md:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Professional Registration & Compliance
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            {pathway.registration.map((reg, index) => (
              <Badge
                key={index}
                className="p-3 md:p-4 bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm transition-all text-sm md:text-base font-bold rounded-xl md:rounded-2xl flex gap-2 md:gap-3 items-start"
                variant="outline"
              >
                <div className="h-5 w-5 md:h-8 md:w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <Globe className="w-3 h-3 md:w-5 md:h-5" />
                </div>
                <span className="whitespace-pre-line">{reg}</span>
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
```

Replace with (only the icon well's fixed `bg-blue-50 text-blue-600` becomes accent-driven; every `reg` string is unchanged):

```tsx
      {/* Registration Section */}
      {pathway.registration && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-xl md:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Professional Registration & Compliance
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            {pathway.registration.map((reg, index) => (
              <Badge
                key={index}
                className="p-3 md:p-4 bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm transition-all text-sm md:text-base font-bold rounded-xl md:rounded-2xl flex gap-2 md:gap-3 items-start"
                variant="outline"
              >
                <div className={`h-5 w-5 md:h-8 md:w-8 flex items-center justify-center rounded-lg ${accent.iconBg} ${accent.iconText} shrink-0 mt-0.5`}>
                  <Globe className="w-3 h-3 md:w-5 md:h-5" />
                </div>
                <span className="whitespace-pre-line">{reg}</span>
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
```

- [ ] **Step 2: Restyle the mobile pathway `<Select>` icon/text treatment (optional polish)**

Find:

```tsx
                {careerPathways.map((pathway) => (
                  <SelectItem key={pathway.id} value={pathway.id}>
                    <div className="flex items-center gap-3">
                      {iconMap[pathway.id]}
                      <span className="font-bold text-slate-800">
                        {pathway.title.split('(')[0].trim()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
```

This one is already accent-agnostic (just the icon + title) and needs no change — leave as-is. (This step is a no-op confirmation, not an edit — included so the implementer explicitly checks it rather than assuming.)

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, same count as Task 3 (167 tests).

- [ ] **Step 5: Full manual verification — all three tabs, three breakpoints, text preservation**

Start the dev server if not already running (`npm run dev`). Using the browser tool:

1. Navigate to `/career-pathway`.
2. For each pathway tab (Assessor, Facilitator, Library) at desktop (~1280px), tablet (~768px), and mobile (~375px) widths:
   - Confirm layout doesn't overflow horizontally at any width.
   - Confirm the tab bar / mobile select both work and switch content.
   - Confirm the registration badges wrap cleanly and use the pathway's accent color.
3. Text preservation check — for at least one pathway (recommend `library`, the longest), use `get_page_text` (or equivalent) on the rendered page and manually diff against the corresponding entry in `lib/pathwayData.ts`: every step title, every `requirements` string, every `description` bullet/paragraph, and every `registration` entry must be present verbatim (HTML tags like `<strong>` inside description strings will render as formatting, not literal text — that's expected and matches current behavior, not a regression).
4. Confirm no console errors (`read_console_messages`, `onlyErrors: true`).

- [ ] **Step 6: Commit**

```bash
git add components/sections/careerpathways/CareerPathwayComp.tsx
git commit -m "style: apply pathway accent to registration badges, complete bento redesign"
```

---

## Self-review notes

- **Spec coverage:** switcher restyle (Task 2), summary tile (Task 2), bento step grid with content-weighted spans (Task 1 + Task 3), registration section (Task 4), per-pathway accent (Task 1 helper, applied in Tasks 2–4), no `pathwayData.ts`/`page.tsx` changes (never touched in any task), no-text-change constraint (called out explicitly in Global Constraints and verified in Task 4 Step 5) — all covered.
- **Fallback in spec** (simplify span calc to array-length-based if the weight heuristic looks fragile): not pre-built as a branch in the plan — if Task 3's manual visual check in Step 5 shows awkward spans for a real pathway, adjust the two threshold constants (`LARGE_WEIGHT_THRESHOLD`, `MEDIUM_WEIGHT_THRESHOLD`) in `lib/pathwayLayout.ts` and re-run the Task 1 tests (they'll need updated expected values matching the new thresholds) before continuing — don't silently change behavior without updating its tests.
