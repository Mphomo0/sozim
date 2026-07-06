// Static menus (Navbar, Contact Learning) reference courses by stable Convex
// ID. The slug here is only the fallback when Convex is unreachable at render
// time — the live slug comes from getCourseSlugMap() in lib/queries.ts, so a
// slug renamed in the admin dashboard shows up in menus on the next render.
// Client-safe: no server imports.

export const MENU_COURSES = {
  libraryAssistant: {
    id: 'jd7aetgjc0qs1p2x65b4dz8nax82e1dp',
    slug: 'library-assistant',
  },
  learningDevelopmentFacilitator: {
    id: 'jd73pdzr7by2fg8npqb4zvw5mh82fsw1',
    slug: 'learning-and-development-facilitator',
  },
  assessmentPractitioner: {
    id: 'jd74ajdjhj01hdrg48whbak7fd82ezzm',
    slug: 'assessment-practioner',
  },
  conductOutcomesBasedAssessment: {
    id: 'jd7brhpjdrhzhnpb4kkyjpfnbs82fxmm',
    slug: 'conduct-outcomes-based-assesment',
  },
  facilitateLearning: {
    id: 'jd722pky3b0ykj0km73xnpkdd982frsa',
    slug: 'facilitate-learning-using-a-variety-of-given-methodologies',
  },
  conductModeration: {
    id: 'jd76nnzgs03836p1z0fes73dh582fhz1',
    slug: 'conduct-moderation-of-outcomes-based-assessment',
  },
} as const

export type CourseSlugMap = Record<string, string>

export function courseHref(
  course: { id: string; slug: string },
  slugMap?: CourseSlugMap,
): string {
  return `/courses/${slugMap?.[course.id] ?? course.slug}`
}
