# Career Pathways page redesign

Date: 2026-08-16

## Problem

`/career-pathway` (rendered by `CareerPathwayComp`) uses a dated, uniform
3-column card grid for each pathway's steps. The user wants a fresh, modern
look that holds up responsively across screen sizes — a visual refresh, not
a functional rework. Content, data source, and page-level SEO scaffolding
are correct as-is and out of scope.

## Scope

**In scope:**
- `components/sections/careerpathways/CareerPathwayComp.tsx` — full visual
  rebuild of the pathway switcher, summary tile, and step layout.

**Out of scope:**
- `lib/pathwayData.ts` — data shape and content unchanged.
- `app/career-pathway/page.tsx` — metadata, JSON-LD schemas, `PageHeader`,
  `Breadcrumb` unchanged.
- Animation library choice (`motion/react` stays).
- Any content/copy edits.

## Chosen direction

Bento-style overview grid (selected over a vertical timeline and a guided
stepper concept during brainstorming — see visual mockups discussed in
conversation, not persisted as files).

## Design

### 1. Pathway switcher

Same mechanism as today: desktop segmented tab bar (`Tabs`/`TabsList`),
mobile `<Select>` dropdown below `md`. Restyled only:
- Simpler pill shapes, no backdrop-blur/glass treatment.
- Active tab gets a subtle shadow + the pathway's accent color (see
  "Per-pathway accent" below) instead of a flat blue highlight for every
  pathway.

No change to the tab-switching logic (`useState` + `Tabs value/onValueChange`,
scroll-to-top `useEffect` on tab change) — purely a class/style pass.

### 2. Summary tile

Keep the existing full-width hero card concept (icon, title, NQF badge,
credits badge, description) as the top bento cell. Refine spacing and
border treatment to align with the new step grid below it, but no
structural change.

### 3. Step grid (the actual bento rework)

Replace the current fixed `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` equal
grid with an asymmetric CSS grid:

- Mobile (`< md`): single column, natural top-to-bottom order — asymmetry is
  a `md:`-and-up enhancement only.
- `md:` and up: `grid-auto-rows` based grid where each step gets a
  `row-span` derived from its content length, not from a hardcoded
  per-index rule. This matters because pathways vary a lot: Assessor has 4
  steps with short-to-medium descriptions, Library Assistant has 7 steps
  with long ones. A fixed "step 1 is always small" rule would look wrong
  for some pathways.

**Span calculation:** compute a rough content weight per step from
`pathwayData.ts` at render time (e.g. character count of the flattened
`description` plus a bump for `requirements` being present), bucket it into
2–3 span tiers (e.g. short → `row-span-1`, long → `row-span-2`), and also
vary column width (`md:col-span-1` vs `md:col-span-2`) for the longest
entries so long bullet lists get breathing room instead of a tall, narrow
column. This is a pure display computation local to the component — no
change to `PathwayStep`/`CareerPathway` types in `lib/pathwayData.ts`.

Fallback: if the weighting logic ends up feeling fragile or produces
awkward layouts for edge cases (e.g. a step with `description` as a short
string vs. a long array), simplify to spans derived from
`Array.isArray(description) ? description.length : 1` plus presence of
`requirements`, which is cheap and already available without extra parsing.

### 4. Registration badges section

Keep current concept (wrapped badge list with icon), light spacing/style
polish only to match the new tile borders and radii.

### 5. Per-pathway accent

`iconMap` already assigns a distinct icon per pathway id (`assessor` /
`facilitator` / `library`). Extend this to a small accent map (border/badge
color per pathway) reused across that pathway's tile borders, active tab
state, and NQF/credit badges — replacing the current default-everything-blue
styling. Palette stays within the existing blue/indigo/emerald range (no
new brand colors introduced).

## Testing

No existing test coverage targets this component (visual/presentational,
no business logic). No new automated tests planned — verification is
visual: run the dev server, check `/career-pathway` at mobile / tablet /
desktop breakpoints for all three pathway tabs.

## Risks / open questions

- The content-weight span calculation is a heuristic; it may need a quick
  manual tuning pass per pathway once real content is laid out, rather than
  being "correct" on the first attempt. Flagged in the fallback above.
