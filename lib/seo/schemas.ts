const BASE_URL = 'https://www.sozim.co.za'

/* =========================
   ORGANIZATION
========================= */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Sozim - Accredited Education and Training College',
    alternateName: ['Sozim', 'Sozim College'],
    url: BASE_URL,

    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
      width: 200,
      height: 100,
    },

    image: [
      'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
      'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
    ],

    description:
      'Sozim is an accredited education and training college in Bloemfontein. We offer accredited programmes in Library and Information Science, ETD, and professional skills courses.',

    foundingDate: '2009',

    foundingLocation: {
      '@type': 'Place',
      name: 'Bloemfontein, South Africa',
    },

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+27836680104',
        email: 'admin@sozim.co.za',
        contactType: 'customer service',
        availableLanguage: ['English', 'Afrikaans'],
        areaServed: 'ZA',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+27836680104',
        email: 'admin@sozim.co.za',
        contactType: 'admissions',
        availableLanguage: ['English', 'Afrikaans'],
        areaServed: 'ZA',
      },
    ],

    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
      addressLocality: 'Bloemfontein',
      addressRegion: 'Free State',
      postalCode: '9301',
      addressCountry: 'ZA',
    },

    sameAs: [
      'https://www.facebook.com/sozimtrading',
      'https://www.instagram.com/sozimtrading',
      'https://www.linkedin.com/company/sozim-trading',
      'https://twitter.com/sozimtrading',
      'https://www.youtube.com/@SozimTrading',
    ],

    knowsAbout: [
      'Education and Training',
      'Library and Information Science',
      'ETD Courses',
      'Skills Development',
      'Career Development',
      'SAQA Qualifications',
    ],

    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Education and Training Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Library and Information Science',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Education Training and Development',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Professional Skills Development',
          },
        },
      ],
    },

    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'ETDP SETA Accreditation',
        recognizedBy: {
          '@type': 'Organization',
          name: 'ETDP SETA',
          url: 'https://www.etdpseta.org.za',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'QCTO Registration',
        recognizedBy: {
          '@type': 'Organization',
          name: 'QCTO',
          url: 'https://www.qcto.org.za',
        },
      },
    ],

    award: ['Accredited Education Provider South Africa'],

    numberOfEmployees: '4',
  }
}

/* =========================
   WEBSITE
========================= */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Sozim College',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/library?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-ZA',
  }
}

/* =========================
   LOCAL BUSINESS
========================= */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'Sozim College',
    url: BASE_URL,
    telephone: '+27836680104',

    address: {
      '@type': 'PostalAddress',
      streetAddress:
        'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
      addressLocality: 'Bloemfontein',
      addressRegion: 'Free State',
      postalCode: '9301',
      addressCountry: 'ZA',
    },

    geo: {
      '@type': 'GeoCoordinates',
      latitude: -29.1167,
      longitude: 26.2167,
    },
  }
}

/* =========================
   COURSE
========================= */
export function getCourseSchema(params: {
  name: string
  description: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: params.name,
    description: params.description,

    url: params.url || `${BASE_URL}/courses`,

    provider: {
      '@id': `${BASE_URL}/#organization`,
    },

    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'online',
      },
      {
        '@type': 'CourseInstance',
        courseMode: 'face-to-face',
      },
    ],
  }
}

/* =========================
   FAQ
========================= */
export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/* =========================
   WEBPAGE
========================= */
export function getWebPageSchema(params: {
  name: string
  description: string
  url?: string
  speakable?: string[]
  lastModified?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${params.url || BASE_URL}#webpage`,
    url: params.url || BASE_URL,
    name: params.name,
    description: params.description,

    ...(params.lastModified && {
      dateModified: params.lastModified,
    }),

    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },

    about: {
      '@id': `${BASE_URL}/#organization`,
    },

    ...(params.speakable && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: params.speakable,
      },
    }),
  }
}

/* =========================
   ARTICLE
========================= */
export function getArticleSchema(params: {
  headline: string
  description: string
  datePublished: string
  dateModified: string
  url?: string
  author?: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${params.url || BASE_URL}#article`,

    headline: params.headline,
    description: params.description,

    url: params.url,

    mainEntityOfPage: params.url,

    author: {
      '@type': 'Person',
      name: params.author || 'Sozim Team',
    },

    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },

    datePublished: params.datePublished,
    dateModified: params.dateModified,

    ...(params.keywords && {
      keywords: params.keywords.join(', '),
    }),
  }
}

/* =========================
   BREADCRUMB
========================= */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/* =========================
   EVENT
========================= */
export function getEventSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',

    name: 'Sozim Education Programs',
    description:
      'Accredited education and training programmes at Sozim College in Bloemfontein',

    startDate: '2026-01-01',
    endDate: '2027-12-31',

    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',

    location: {
      '@type': 'Place',
      name: 'Sozim College',
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
        addressLocality: 'Bloemfontein',
        addressRegion: 'Free State',
        postalCode: '9301',
        addressCountry: 'ZA',
      },
    },

    organizer: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

/* =========================
   AGGREGATE RATING (FIXED)
========================= */
export function getAggregateRatingSchema(params: {
  ratingValue: string
  reviewCount: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',

    ratingValue: params.ratingValue,
    reviewCount: params.reviewCount,

    bestRating: '5',
    worstRating: '1',
  }
}

/* =========================
   PERSON
========================= */
export function getPersonSchema(params: {
  name: string
  jobTitle: string
  description: string
  credentials?: {
    qualifications: string[]
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',

    name: params.name,
    jobTitle: params.jobTitle,
    description: params.description,

    ...(params.credentials && {
      knowsAbout: params.credentials.qualifications,
    }),

    memberOf: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

/* =========================
   CREDENTIAL
========================= */
export function getEducationalOccupationalCredentialSchema(params: {
  name: string
  description: string
  credentialCategory: string
  url?: string
  recognizedBy?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',

    name: params.name,
    description: params.description,
    credentialCategory: params.credentialCategory,

    url: params.url || `${BASE_URL}/courses`,

    ...(params.recognizedBy && {
      recognizedBy: params.recognizedBy.map((org) => ({
        '@type': 'Organization',
        name: org,
      })),
    }),
  }
}

/* =========================
   HOW-TO
========================= */
export function getHowToSchema(params: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',

    name: params.name,
    description: params.description,

    step: params.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
