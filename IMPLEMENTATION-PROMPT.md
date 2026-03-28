# GEO Implementation Prompt for Sozim.co.za

---

## Context

You are implementing Generative Engine Optimization (GEO) fixes for https://www.sozim.co.za, an education/training business in Bloemfontein, South Africa.

---

## Phase 1: Critical Fixes (Week 1)

### 1.1 Generate `/llms.txt` file

Create an `llms.txt` file at the site root (public/llms.txt or equivalent) with this structure:

```
# Sozim Trading and Consultancy

## Site Overview
Sozim Trading and Consultancy provides accredited education and trading courses in South Africa. Founded in 2009, we offer certificates, undergraduate, graduate, and online learning programs.

## Pages

### Home (/)
- Transform Your Future - World-class education
- 5000+ Students Enrolled, 50+ Expert Instructors, 20+ Programs, 95% Success Rate
- Programs: Undergraduate, Graduate, Online Learning, Certificates

### About (/about)
- Mission: Deliver tailored training programs for safe workplaces and compliance standards
- Vision: Create a literate tomorrow through exceptional library and information training
- Values: Excellence, Innovation and Impact, Accountability, Care, Social Justice, Sustainability
- Founded: 2009, 10,000+ Graduates, QCTO Accredited, SAQA Aligned

### Courses (/courses)
- Industry-recognized programs designed for career advancement
- Loading dynamically from database

### Career Pathways (/career-pathway)
- NQF 5, 6, 7 qualifications
- Career progression guidance

### Campus (/campus)
- Physical location in Bloemfontein

### Library (/library)
- Educational resources (populated from database)

### Shop (/shop)
- Sozim Store for materials

### Contact (/contact)
- Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein
- Phone: (+27) 83 668 0104
- Email: admin@sozim.co.za

---

## Required Actions

### 1.2 Author Attribution
Add "Sozim Team" as author byline to:
- Homepage
- About page
- Courses page
- Career Pathways page

Implementation: Add `<meta name="author" content="Sozim Team">` to page head, or add byline in UI

### 1.3 Publication Dates
Add `datePublished` and `dateModified` meta tags to all pages:
```html
<meta property="article:published_time" content="2026-03-28T00:00:00Z">
<meta property="article:modified_time" content="2026-03-28T00:00:00Z">
```

### 1.4 Privacy Policy & Terms
Create:
- `/privacy-policy` - Privacy policy page
- `/terms-of-service` - Terms and conditions page

Link both from footer.

---

## Phase 2: Technical Fixes (Week 2)

### 2.1 Fix Courses Page SSR
Ensure courses page renders server-side, not client-side. The page currently shows "Loading..." in raw HTML.

Solution options:
- Implement SSR for courses data
- Or add fallback content in HTML before JavaScript loads

### 2.2 Complete FAQ Section
On `/contact` page, answer all 4 FAQ questions. Currently only 1 is answered.

### 2.3 Enhance Organization Schema
Update existing Organization schema to include:
```json
{
  "@type": "Organization",
  "name": "Sozim Trading and Consultancy",
  "url": "https://www.sozim.co.za",
  "logo": "https://ik.imagekit.io/vzofqg2fg/images/SozimLogo.webp",
  "description": "Accredited education and trading courses in South Africa",
  "foundingDate": "2009",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop 4, Sunday School Building, 154 Charlotte Maxeke Street",
    "addressLocality": "Bloemfontein",
    "addressCountry": "ZA"
  },
  "knowsAbout": ["Education", "Training", "Trading Courses", "Professional Development", "SAQA Qualifications"]
}
```

### 2.4 Add LocalBusiness Schema
Add separate LocalBusiness schema for Bloemfontein campus:
```json
{
  "@type": "LocalBusiness",
  "name": "Sozim Trading and Consultancy",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-29.1167",
    "longitude": "26.2167"
  },
  "openingHours": "Mo-Fr 08:00-17:00"
}
```

---

## Phase 3: Schema Enhancements (Week 3)

### 3.1 Add EducationalOccupationalProgram Schema
For each course page, add:
```json
{
  "@type": "EducationalOccupationalProgram",
  "name": "[Course Name]",
  "description": "[Course Description]",
  "educationalLevel": "NQF Level X",
  "provider": {
    "@type": "Organization",
    "name": "Sozim Trading and Consultancy"
  }
}
```

### 3.2 Add sameAs Links
Add to Organization schema:
```json
"sameAs": [
  "https://twitter.com/sozim",
  "https://youtube.com/@sozim",
  "https://wikipedia.org/wiki/Sozim",
  "https://wikidata.org/wiki/Q[ID]"
]
```
(Replace with actual URLs once available)

---

## Implementation Notes

- Site is built with Next.js (uses `/_next/static/`)
- Existing schema is JSON-LD format
- Current robots.txt allows all crawlers
- Sitemap exists at `/sitemap.xml`

---

## Priority Order

1. llms.txt (1.1)
2. Author bylines (1.3)
3. Publication dates (1.4)
4. Privacy & Terms (1.5)
5. FAQ completion (2.2)
6. Schema enhancements (2.3, 2.4, 3.1, 3.2)
7. SSR fix (2.1)

---

## Completion Criteria

- [ ] llms.txt accessible at /llms.txt
- [ ] All content pages have author="Sozim Team" meta tag
- [ ] All pages have datePublished meta tags
- [ ] Privacy policy page exists and linked
- [ ] Terms of service page exists and linked
- [ ] FAQ section fully populated
- [ ] Organization schema includes knowsAbout, foundingDate, sameAs
- [ ] LocalBusiness schema with geo coordinates added
- [ ] Course pages have EducationalOccupationalProgram schema
