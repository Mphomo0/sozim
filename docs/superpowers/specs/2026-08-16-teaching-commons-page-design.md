# Teaching Commons page

Date: 2026-08-16

## Problem

Sozim's Teaching Commons (TC) unit — the Centre for Teaching and Learning —
has no presence on the website. The Academic Manager (Dr Mahlaga J Molepo)
supplied a welcome letter describing the unit's mission and current
programmes. The site needs a landing page for the TC, plus navigation entry
points, with the understanding that the unit's sub-areas (Staff, Core Areas,
Flagship Programmes, Events) will get their own dedicated pages later — not
now.

## Scope

**In scope:**
- New route `app/teaching-commons/page.tsx` — a content page for the TC,
  following the same structural pattern as `/about` and `/campus`.
- New component `components/sections/teachingcommons/TeachingCommonsIntro.tsx`
  rendering the welcome letter plus two short highlight sections.
- `components/global/Navbar.tsx` — add "Teaching Commons" as a 4th group
  under the "Academic Schools" dropdown, with 4 sub-links (Staff, Core
  Areas, Flagship Programmes, Events).
- Fix the dropdown title link's `href` (currently uses the literal
  `sub.title` string as a URL — a pre-existing bug) so "Teaching Commons"
  can actually link to `/teaching-commons`.

**Out of scope:**
- Dedicated pages for Staff / Core Areas / Flagship Programmes / Events —
  these are deliberately left unbuilt. Their nav links point to routes with
  no page file, so Next's default not-found page handles them.
- `components/global/Footer.tsx` — not mentioned by the user, no footer
  change.
- `components/sections/about/Leadership.tsx` — lists Dr Molepo as "Academic
  Director"; the letter signs as "Academic Manager". Not reconciled — out
  of scope, unrelated file, no instruction to change it.

## Content source

All page copy comes directly from the supplied letter
(`Welcome to the Teaching Commons at Sozim.docx.pdf`) — no invented copy
beyond section headings needed to organize the letter's own content into
skimmable sections.

## Design

### 1. Route: `app/teaching-commons/page.tsx`

Server component, matching `/about`/`/campus` conventions exactly:
- `export const revalidate = 86400` (24h — static content, rarely changes).
- `Metadata` export: title, description, keywords, OpenGraph, Twitter,
  canonical — following the existing title/description tone used across
  the site (accredited, Bloemfontein, ETDP SETA framing).
- `<Breadcrumb />` then `<PageHeader title="Teaching Commons" details="..." />`
  then `<TeachingCommonsIntro />`.
- JSON-LD: `getBreadcrumbSchema` + `getWebPageSchema` (same helpers already
  used by `/about`/`/campus`), no `FAQSchema` (no FAQ content here).

### 2. Component: `TeachingCommonsIntro.tsx`

Three sections in one component (small enough not to warrant further
splitting):

1. **Welcome letter** — the letter's body paragraphs verbatim, in a
   readable prose block (similar width/typography treatment to the
   `PathwayDetail` summary card's italic quote block elsewhere in the
   codebase, but here as plain paragraphs, not a quote). Signed:
   "Dr Mahlaga J Molepo, Academic Manager" — title exactly as the letter
   states it.
2. **Core Focus Areas** — short card list (3 items), text taken verbatim
   from the letter: Facilitator and Student Advising; Student Professional
   Development and Technology Access; Academic Writing and Multi-Literacy
   Development.
3. **Flagship Programmes** — short card list (3 items), verbatim from the
   letter: Comprehensive Course (Re)Design (CCRD) Programs; Formalised Peer
   Observation and Reflection (FPOR) Program; Accelerated Study Support
   (ASS).

Visual style: reuse existing card/section patterns already in the codebase
(e.g. `Card`/`CardContent` from `components/ui/card`, section heading +
divider line pattern used in `CareerPathwayComp.tsx`'s "Career Progression"
heading) rather than inventing a new visual language.

### 3. Navbar changes

In `mainMenuItems`'s "Academic Schools" dropdown array
(`components/global/Navbar.tsx`), add a 4th group after "ETDP SETA Skills
Programmes":

```ts
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
```

The dropdown group type gains an optional `href` field. Both places the
group title is rendered as a `<Link>` (desktop dropdown ~line 417, mobile
dropdown ~line 485) currently do:

```tsx
href={sub.title || sub.links?.[0]?.href || '#'}
```

This is a pre-existing bug: `sub.title` is a display string, not a URL, so
clicking an existing group title (e.g. "School of Arts and Humanities")
navigates to a nonsense relative path. Fix both to:

```tsx
href={sub.href || sub.links?.[0]?.href || '#'}
```

For the 3 existing groups (no `href` field), this falls back to their
first sub-link's href — the closest approximate behavior to "clicking the
title does something reasonable" that existed conceptually before, now
actually working instead of silently broken. For "Teaching Commons", it
links to `/teaching-commons` directly.

Sub-links for Staff/Core Areas/Flagship Programmes/Events point to routes
with no corresponding page file under `app/teaching-commons/`, so
navigating to them hits Next's default `not-found` page — no explicit
`not-found.tsx` work needed for this to happen.

## Testing

No new unit-testable logic — this is a content page + a small navbar data
change. Verification is:
- `npx tsc --noEmit` clean.
- `npx vitest run` — no regressions to existing 159 tests.
- Manual browser check: `/teaching-commons` renders with letter + both
  highlight sections; Academic Schools dropdown shows "Teaching Commons"
  as a 4th group linking correctly; the 3 existing group titles still
  navigate to their first course link (regression check for the href fix);
  the 4 new sub-links each hit a 404/not-found page.

## Risks / open questions

None outstanding — scope and content are both fully specified from the
supplied letter, and the nav-link bug fix is narrowly scoped to the two
`href` expressions being changed.
