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
    alternateName: ['Sozim', 'Sozim College', 'Sozim Trading and Consultancy'],
    legalName: 'Sozim Trading and Consultancy',
    url: BASE_URL,

    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
      width: 200,
      height: 100,
      caption: 'Sozim College Logo',
    },

    image: [
      'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
      'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
    ],

    description:
      'Sozim is an ETDP SETA accredited education and training college in Bloemfontein, South Africa, founded in 2009. We offer accredited programmes in Library and Information Science (LIS), Education Training and Development (ETD), and professional skills development aligned with SAQA and QCTO standards.',

    foundingDate: '2009',

    foundingLocation: {
      '@type': 'Place',
      name: 'Bloemfontein, Free State, South Africa',
    },

    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+27836680104',
        email: 'admin@sozim.co.za',
        contactType: 'customer service',
        availableLanguage: ['English', 'Afrikaans'],
        areaServed: 'ZA',
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:00',
          closes: '17:00',
        },
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
      streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
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

    hasMap: 'https://maps.google.com/?q=Sozim+College,+154+Charlotte+Maxeke+Street,+Bloemfontein',

    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],

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
      'Education Training and Development',
      'Skills Development',
      'Career Development',
      'SAQA Qualifications',
      'NQF Framework South Africa',
      'Assessment Practitioner Training',
      'Learning and Development Facilitation',
    ],

    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Accredited Education and Training Programmes',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Library Assistant',
            description: 'Accredited Library and Information Science programme at NQF Level 3',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Learning and Development Facilitator',
            description: 'Accredited Education Training and Development facilitator programme',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Assessment Practitioner',
            description: 'Accredited assessment and moderation practitioner programme',
          },
        },
      ],
    },

    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'ETDP SETA Accreditation',
        credentialCategory: 'Accreditation',
        recognizedBy: {
          '@type': 'Organization',
          name: 'ETDP SETA',
          url: 'https://www.etdpseta.org.za',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'QCTO Registration',
        credentialCategory: 'Registration',
        recognizedBy: {
          '@type': 'Organization',
          name: 'QCTO',
          url: 'https://www.qcto.org.za',
        },
      },
    ],

    award: ['Accredited Education Provider South Africa'],
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 4,
    },
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
    description: 'Accredited education and training college in Bloemfontein, South Africa.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/library?q={search_term_string}`,
      },
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
    legalName: 'Sozim Trading and Consultancy',
    url: BASE_URL,
    telephone: '+27836680104',
    email: 'admin@sozim.co.za',

    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
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

    hasMap: 'https://maps.google.com/?q=Sozim+College,+154+Charlotte+Maxeke+Street,+Bloemfontein',

    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],

    priceRange: '$$',
    currenciesAccepted: 'ZAR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, EFT',

    image: 'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',

    sameAs: [
      'https://www.facebook.com/sozimtrading',
      'https://www.instagram.com/sozimtrading',
      'https://www.linkedin.com/company/sozim-trading',
    ],
  }
}

/* =========================
   COURSE
========================= */
export function getCourseSchema(params: {
  name: string
  description: string
  url?: string
  level?: string
  duration?: string
  teaches?: string[]
  prerequisites?: string
  inLanguage?: string
  isOpen?: boolean
  careerOutcomes?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${params.url || BASE_URL + '/courses'}#course`,
    name: params.name,
    description: params.description,
    url: params.url || `${BASE_URL}/courses`,
    inLanguage: params.inLanguage || 'en-ZA',

    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Sozim College',
      url: BASE_URL,
      sameAs: BASE_URL,
    },

    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Accredited Certificate',
      credentialCategory: 'Certificate',
      recognizedBy: [
        { '@type': 'Organization', name: 'ETDP SETA', url: 'https://www.etdpseta.org.za' },
        { '@type': 'Organization', name: 'QCTO', url: 'https://www.qcto.org.za' },
        { '@type': 'Organization', name: 'SAQA', url: 'https://www.saqa.org.za' },
      ],
    },

    ...(params.level && { educationalLevel: params.level }),
    ...(params.duration && { timeRequired: params.duration }),

    ...(params.teaches && params.teaches.length > 0 && {
      teaches: params.teaches,
    }),

    ...(params.prerequisites && {
      coursePrerequisites: params.prerequisites,
    }),

    ...(params.careerOutcomes && params.careerOutcomes.length > 0 && {
      keywords: params.careerOutcomes.join(', '),
    }),

    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      geographicArea: 'South Africa',
    },

    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        inLanguage: 'en-ZA',
        courseWorkload: params.duration || 'PT40H',
        location: {
          '@type': 'VirtualLocation',
          url: `${BASE_URL}/courses`,
        },
      },
      {
        '@type': 'CourseInstance',
        courseMode: 'Onsite',
        inLanguage: 'en-ZA',
        courseWorkload: params.duration || 'PT40H',
        location: {
          '@type': 'Place',
          name: 'Sozim College',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
            addressLocality: 'Bloemfontein',
            addressRegion: 'Free State',
            postalCode: '9301',
            addressCountry: 'ZA',
          },
        },
      },
    ],
  }
}

/* =========================
   ITEM LIST (for courses listing page)
========================= */
export function getItemListSchema(items: {
  name: string
  url: string
  description?: string
  position?: number
}[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sozim Accredited Courses and Programmes',
    description: 'Full list of accredited education and training programmes offered by Sozim College in Bloemfontein, South Africa.',
    url: `${BASE_URL}/courses`,
    numberOfItems: items.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      item: {
        '@type': 'Course',
        name: item.name,
        url: item.url,
        ...(item.description && { description: item.description }),
        provider: { '@id': `${BASE_URL}/#organization` },
      },
    })),
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
  breadcrumb?: { name: string; url: string }[]
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': params.type || 'WebPage',
    '@id': `${params.url || BASE_URL}#webpage`,
    url: params.url || BASE_URL,
    name: params.name,
    description: params.description,
    inLanguage: 'en-ZA',

    ...(params.lastModified && { dateModified: params.lastModified }),

    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },

    about: {
      '@id': `${BASE_URL}/#organization`,
    },

    ...(params.breadcrumb && {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: params.breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    }),

    ...(params.speakable && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: params.speakable,
      },
    }),

    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
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
  image?: string
  type?: 'Article' | 'NewsArticle'
  articleSection?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': params.type || 'Article',
    '@id': `${params.url || BASE_URL}#article`,

    headline: params.headline,
    description: params.description,
    url: params.url,
    mainEntityOfPage: { '@id': `${params.url || BASE_URL}#webpage` },

    author: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: params.author || 'Sozim Team',
    },

    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },

    datePublished: params.datePublished,
    dateModified: params.dateModified,
    inLanguage: 'en-ZA',

    image: params.image || {
      '@type': 'ImageObject',
      url: `${BASE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
    },

    ...(params.keywords && { keywords: params.keywords.join(', ') }),
    ...(params.articleSection && { articleSection: params.articleSection }),
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
  const year = new Date().getFullYear()
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',

    name: 'Sozim Education Programme Intake',
    description:
      'Accredited education and training programme intakes at Sozim College in Bloemfontein. Enrol in LIS and ETD programmes throughout the year.',

    image: ['https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg'],

    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,

    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',

    location: [
      {
        '@type': 'Place',
        name: 'Sozim College',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
          addressLocality: 'Bloemfontein',
          addressRegion: 'Free State',
          postalCode: '9301',
          addressCountry: 'ZA',
        },
      },
      {
        '@type': 'VirtualLocation',
        url: BASE_URL,
      },
    ],

    organizer: {
      '@type': 'EducationalOrganization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Sozim College',
      url: BASE_URL,
    },

    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/apply`,
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'ZAR',
      validFrom: `${year}-01-01`,
    },
  }
}

/* =========================
   PLACE / CAMPUS
========================= */
export function getPlaceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${BASE_URL}/#place`,
    name: 'Sozim College - Bloemfontein Campus',
    url: `${BASE_URL}/campus`,
    description: 'Sozim College campus in Bloemfontein, Free State. Face-to-face contact learning facilities for accredited education and training programmes.',

    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
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

    hasMap: 'https://maps.google.com/?q=Sozim+College,+154+Charlotte+Maxeke+Street,+Bloemfontein',

    telephone: '+27836680104',

    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '09:00',
        closes: '13:00',
      },
    ],

    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Classrooms', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Computer Labs', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Student Lounge', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Student Support Services', value: true },
    ],

    containedInPlace: {
      '@type': 'CivicStructure',
      name: 'Sunday School Building',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bloemfontein',
        addressRegion: 'Free State',
        addressCountry: 'ZA',
      },
    },
  }
}

/* =========================
   DEFINED TERM (AEO - entity definitions for AI engines)
========================= */
export function getDefinedTermSchema(terms: {
  name: string
  description: string
  url?: string
  sameAs?: string[]
}[]) {
  return terms.map((term) => ({
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.name,
    description: term.description,
    ...(term.url && { url: term.url }),
    ...(term.sameAs && { sameAs: term.sameAs }),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Sozim Education Glossary',
      url: `${BASE_URL}/about`,
    },
  }))
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
      hasCredential: params.credentials.qualifications.map((q) => ({
        '@type': 'EducationalOccupationalCredential',
        name: q,
      })),
    }),

    memberOf: {
      '@id': `${BASE_URL}/#organization`,
    },

    worksFor: {
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
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',

    name: params.name,
    description: params.description,
    ...(params.totalTime && { totalTime: params.totalTime }),

    step: params.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

/* =========================
   SPEAKABLE (standalone)
========================= */
export function getSpeakableSchema(params: {
  headline: string
  speakableText: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.headline,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: params.speakableText,
    },
  }
}

/* =========================
   AGGREGATE RATING (standalone — use inside Organization/LocalBusiness)
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
