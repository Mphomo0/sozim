# Teaching Commons Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/teaching-commons` landing page (welcome letter + two highlight sections) and wire it into the Navbar's "Academic Schools" dropdown as a 4th group with 4 sub-links, without building the sub-pages themselves.

**Architecture:** One new server-component route (`app/teaching-commons/page.tsx`) following the exact `/about`/`/campus` page pattern (Metadata + Breadcrumb + PageHeader + JSON-LD + content component), backed by one new presentational component. A small data + one-line-fix change in `Navbar.tsx` adds the nav entry and fixes a pre-existing broken `href` on dropdown group titles.

**Tech Stack:** Next.js App Router (server components), Tailwind CSS v4, shadcn/ui `Card`/`CardContent`, existing `lib/seo/schemas.ts` helpers.

## Global Constraints

- All page copy comes verbatim from the supplied letter — no invented content beyond section headings.
- Dr Molepo's signature reads exactly "Dr Mahlaga J Molepo, Academic Manager" (as the letter states it) — do not reconcile with `Leadership.tsx`'s "Academic Director" listing; that file is untouched.
- Staff / Core Areas / Flagship Programmes / Events do NOT get page files — their nav links must 404 via Next's default not-found page.
- `components/global/Footer.tsx` is not touched.
- `revalidate = 86400` on the new route, matching `/about`/`/campus`.

---

### Task 1: Teaching Commons content component

**Files:**
- Create: `components/sections/teachingcommons/TeachingCommonsIntro.tsx`

**Interfaces:**
- Produces: `export default function TeachingCommonsIntro()` — a zero-prop component, consumed by Task 2's page.

- [ ] **Step 1: Create the component**

```tsx
import { Card, CardContent } from '@/components/ui/card'

const coreFocusAreas = [
  'Facilitator and Student Advising',
  'Student Professional Development and Technology Access',
  'Academic Writing and Multi-Literacy Development',
]

const flagshipProgrammes = [
  {
    acronym: 'CCRD',
    name: 'Comprehensive Course (Re) Design Programs',
  },
  {
    acronym: 'FPOR',
    name: 'Formalised Peer Observation and Reflection Program',
  },
  {
    acronym: 'ASS',
    name: 'Accelerated Study Support',
  },
]

export default function TeachingCommonsIntro() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto py-16 px-4 space-y-16 max-w-4xl">
        {/* Welcome letter */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="text-xl md:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome to the Teaching Commons at Sozim
            </h2>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="space-y-5 text-base md:text-lg text-slate-600 leading-relaxed">
            <p>
              Innovation is at the center of teaching and learning activities
              at Sozim. The Teaching Commons (TC), also known as the Centre
              for Teaching and Learning, is an academic support centre which
              has a shared interest in supporting learning and teaching
              activities at Sozim.
            </p>
            <p>
              The TC at Sozim is committed to the college&rsquo;s philosophy
              of training and skills development - centered around creating
              a learning culture that directly improves job performance and
              contributes to organisational success.
            </p>
            <p>
              As Academic Manager, I welcome you to make use of the
              resources we have developed for the success of our students
              and staff.
            </p>
            <p>
              The mission of the TC at Sozim is to partner with academic
              schools to create transformative learning experiences by
              instilling critical thinking and bridging the gap between
              theory and practice for all our students.
            </p>
            <p>
              Rapid advancement in technology requires innovative teaching
              and learning. Students need to complete their knowledge,
              practical and work integrated modules on time and with
              identifiable graduate attributes that increase prospects of
              employability.
            </p>
            <p>
              We strive for partnership with all internal college
              stakeholders, including the broader society. We promote
              occupational based training and skills development, foster
              care, inclusivity and diversity for the betterment of society.
            </p>
            <p>
              The TC&rsquo;s core focus is on Facilitator and Student
              Advising, Student Professional Development and Technology
              Access, Academic Writing and Multi-Literacy Development.
              Academic schools and student success support flagship
              programmes include Comprehensive Course (Re) Design (CCRD)
              Programs, Formalised Peer Observation and Reflection (FPOR)
              Program; Accelerated Study Support (ASS).
            </p>
            <p>
              I encourage you to make use of the resources available at the
              TC. Let us continue to close the skills gap in the South
              African library and information services sector through
              innovative teaching and learning initiatives. Together, we can
              open up more career pathways for unemployed youth interested
              in information services. We can empower public and community
              libraries that are under-capacitated libraries and struggling
              to meet the community&rsquo;s information, digital and
              computer literacy needs.
            </p>
            <p>
              Thank you for being part of a team that transforms the future.
            </p>
          </div>

          <div className="pt-4 text-base text-slate-700">
            <p>Sincerely,</p>
            <p className="font-bold text-slate-900">Dr Mahlaga J Molepo</p>
            <p>Academic Manager</p>
          </div>
        </section>

        {/* Core Focus Areas */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Core Focus Areas
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreFocusAreas.map((area) => (
              <Card
                key={area}
                className="h-full border-slate-200/60 shadow-sm"
              >
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {area}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flagship Programmes */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Flagship Programmes
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flagshipProgrammes.map((programme) => (
              <Card
                key={programme.acronym}
                className="h-full border-slate-200/60 shadow-sm"
              >
                <CardContent className="p-6 space-y-1">
                  <p className="text-xs font-bold tracking-wide text-blue-600 uppercase">
                    {programme.acronym}
                  </p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {programme.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/teachingcommons/TeachingCommonsIntro.tsx
git commit -m "feat: add Teaching Commons intro content component"
```

---

### Task 2: Teaching Commons route

**Files:**
- Create: `app/teaching-commons/page.tsx`

**Interfaces:**
- Consumes: `TeachingCommonsIntro` (default export, no props) from Task 1, at `@/components/sections/teachingcommons/TeachingCommonsIntro`.
- Consumes: `getBreadcrumbSchema(items: { name: string; url: string }[])` and `getWebPageSchema(params: { name: string; description: string; url?: string; breadcrumb?: {name:string;url:string}[] })` from `@/lib/seo/schemas` (already defined, unchanged).
- Consumes: `PageHeader` (`{ title: string; details: string }`) from `@/components/global/PageHeader`, `Breadcrumb` (no props) from `@/components/global/Breadcrumb` — both already used identically by `app/about/page.tsx` and `app/campus/page.tsx`.

- [ ] **Step 1: Create the page**

```tsx
import type { Metadata } from 'next'

export const revalidate = 86400

import PageHeader from '@/components/global/PageHeader'
import Breadcrumb from '@/components/global/Breadcrumb'
import TeachingCommonsIntro from '@/components/sections/teachingcommons/TeachingCommonsIntro'
import { getBreadcrumbSchema, getWebPageSchema } from '@/lib/seo/schemas'

const BASE_URL = 'https://www.sozim.co.za'

export const metadata: Metadata = {
  title: 'Teaching Commons – Centre for Teaching and Learning',
  description:
    'The Teaching Commons (TC) at Sozim is an academic support centre partnering with academic schools to create transformative learning experiences in Bloemfontein, South Africa.',
  keywords: [
    'Teaching Commons Sozim',
    'Centre for Teaching and Learning',
    'Sozim academic support',
    'teaching and learning Bloemfontein',
    'academic development South Africa',
  ],
  openGraph: {
    title: 'Teaching Commons | Sozim - Accredited Education and Training College',
    description:
      'The Teaching Commons (TC) at Sozim partners with academic schools to create transformative learning experiences for students and staff.',
    url: `${BASE_URL}/teaching-commons`,
    siteName: 'Sozim',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Teaching Commons - Sozim',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teaching Commons | Sozim',
    description:
      'The Teaching Commons (TC) at Sozim partners with academic schools to create transformative learning experiences.',
    images: ['/og-image.jpg'],
    site: '@sozimtrading',
  },
  alternates: {
    canonical: `${BASE_URL}/teaching-commons`,
  },
}

export default function TeachingCommonsPage() {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Teaching Commons', url: `${BASE_URL}/teaching-commons` },
  ])
  const webPageSchema = getWebPageSchema({
    name: 'Teaching Commons | Sozim',
    description:
      'The Teaching Commons (TC) at Sozim is an academic support centre partnering with academic schools to create transformative learning experiences.',
    url: `${BASE_URL}/teaching-commons`,
    breadcrumb: [
      { name: 'Home', url: BASE_URL },
      { name: 'Teaching Commons', url: `${BASE_URL}/teaching-commons` },
    ],
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Breadcrumb />
      <PageHeader
        title="Teaching Commons"
        details="The Centre for Teaching and Learning at Sozim — partnering with academic schools to create transformative learning experiences."
      />
      <TeachingCommonsIntro />
    </>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, same count as before this task (159 tests) — this task adds no new test files.

- [ ] **Step 4: Manual verification**

Start the dev server (`npm run dev`) if not already running. Navigate to `/teaching-commons`. Confirm:
- Breadcrumb shows Home > Teaching Commons.
- PageHeader renders "Teaching Commons" title.
- The welcome letter, Core Focus Areas (3 cards), and Flagship Programmes (3 cards) all render with the exact text from the letter.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add app/teaching-commons/page.tsx
git commit -m "feat: add /teaching-commons page"
```

---

### Task 3: Navbar entry + dropdown title href fix

**Files:**
- Modify: `components/global/Navbar.tsx`

**Interfaces:**
- No new exports. Extends the existing inline `mainMenuItems` array (a `useMemo` return value with no explicit interface — TypeScript infers a union type across its object literals, so adding an optional `href` field to one dropdown group is compatible with the existing inferred type without any type declaration changes).

- [ ] **Step 1: Add the "Teaching Commons" dropdown group**

In `components/global/Navbar.tsx`, find the "Academic Schools" dropdown array (inside `mainMenuItems`, currently ending with the "ETDP SETA Skills Programmes" group before its closing `],`):

```tsx
        {
          title: 'ETDP SETA Skills Programmes',
          links: [
            {
              label: 'Outcome-Based Assessment',
              href: courseHref(MENU_COURSES.conductOutcomesBasedAssessment, courseSlugs),
            },
            {
              label: 'Facilitation Using Given Methodologies',
              href: courseHref(MENU_COURSES.facilitateLearning, courseSlugs),
            },
            {
              label: 'Conduct Outcome-Based Moderation',
              href: courseHref(MENU_COURSES.conductModeration, courseSlugs),
            },
          ],
        },
      ],
    },
```

Replace with (adds a 4th group after it, closing the same `dropdown` array):

```tsx
        {
          title: 'ETDP SETA Skills Programmes',
          links: [
            {
              label: 'Outcome-Based Assessment',
              href: courseHref(MENU_COURSES.conductOutcomesBasedAssessment, courseSlugs),
            },
            {
              label: 'Facilitation Using Given Methodologies',
              href: courseHref(MENU_COURSES.facilitateLearning, courseSlugs),
            },
            {
              label: 'Conduct Outcome-Based Moderation',
              href: courseHref(MENU_COURSES.conductModeration, courseSlugs),
            },
          ],
        },
        {
          title: 'Teaching Commons',
          href: '/teaching-commons',
          links: [
            { label: 'Staff', href: '/teaching-commons/staff' },
            { label: 'Core Areas', href: '/teaching-commons/core-areas' },
            { label: 'Flagship Programmes', href: '/teaching-commons/flagship-programmes' },
            { label: 'Events', href: '/teaching-commons/events' },
          ],
        },
      ],
    },
```

- [ ] **Step 2: Fix the dropdown title href bug (desktop)**

Find (there are two occurrences of this exact line in the file — this step is the first one, inside the desktop dropdown block that renders `lg:absolute lg:left-1/2 ...`):

```tsx
                          <Link
                            href={sub.title || sub.links?.[0]?.href || '#'}
                            prefetch={false}
                            className="block text-[14px] font-bold text-blue-900 hover:text-blue-700"
                          >
```

Replace with:

```tsx
                          <Link
                            href={sub.href || sub.links?.[0]?.href || '#'}
                            prefetch={false}
                            className="block text-[14px] font-bold text-blue-900 hover:text-blue-700"
                          >
```

- [ ] **Step 3: Fix the dropdown title href bug (mobile)**

Find the second occurrence (inside the mobile dropdown block, distinguishable by its sibling className `block text-[14px] font-bold text-blue-800 hover:text-blue-600 py-1` — note `blue-800`/`py-1`, different from the desktop block's `blue-900` found in Step 2):

```tsx
                          <Link
                            href={sub.title || sub.links?.[0]?.href || '#'}
                            prefetch={false}
                            className="block text-[14px] font-bold text-blue-800 hover:text-blue-600 py-1"
                          >
```

Replace with:

```tsx
                          <Link
                            href={sub.href || sub.links?.[0]?.href || '#'}
                            prefetch={false}
                            className="block text-[14px] font-bold text-blue-800 hover:text-blue-600 py-1"
                          >
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Run the full test suite**

Run: `npx vitest run`
Expected: PASS, 159 tests (unchanged — no test files touched).

- [ ] **Step 6: Manual verification**

Start the dev server if not already running. On a desktop-width viewport, hover/open the "Academic Schools" dropdown:
- Confirm a 4th group "Teaching Commons" appears after "ETDP SETA Skills Programmes", with 4 sub-links: Staff, Core Areas, Flagship Programmes, Events.
- Click the "Teaching Commons" group title itself — confirm it navigates to `/teaching-commons` (not a broken/nonsense URL).
- Click "School of Arts and Humanities" (an existing group title) — confirm it navigates to its first sub-link's course page (regression check: this group has no `href` field, so it must fall back to `sub.links?.[0]?.href`, unchanged from intended pre-fix behavior).
- Click one of the 4 new sub-links (e.g. "Staff") — confirm it lands on Next's default not-found page (no crash, no broken layout).
- Repeat the same checks in the mobile menu (narrow viewport, hamburger menu).

- [ ] **Step 7: Commit**

```bash
git add components/global/Navbar.tsx
git commit -m "feat: add Teaching Commons to Academic Schools dropdown, fix group title href"
```

---

## Self-review notes

- **Spec coverage:** new route with Metadata/Breadcrumb/PageHeader/JSON-LD (Task 2) ✓; welcome letter + Core Focus Areas + Flagship Programmes content (Task 1) ✓; Navbar 4th dropdown group with 4 sub-links (Task 3, Step 1) ✓; title href bug fix, both occurrences (Task 3, Steps 2–3) ✓; no sub-pages built, verified via manual 404 check (Task 3, Step 6) ✓; Footer/Leadership.tsx untouched (never referenced in any task's Files section) ✓.
- **Placeholder scan:** no TBD/TODO; all code blocks are complete, copy-pasteable content — no "similar to Task N" shortcuts.
- **Type consistency:** `TeachingCommonsIntro` is a zero-prop default export in both Task 1 (produces) and Task 2 (consumes) — matches. `getBreadcrumbSchema`/`getWebPageSchema` call signatures in Task 2 match their real definitions in `lib/seo/schemas.ts` (verified against source during planning, not assumed).
