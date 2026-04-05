const BASE_URL = 'https://www.sozim.co.za'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Sozim Trading and Consultancy',
    alternateName: ['Sozim Trading', 'Sozim'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
      width: 200,
      height: 100,
    },
    image: [
      'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
      'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
    ],
    description:
      'Sozim Trading and Consultancy offers accredited education, professional trading training, and career-focused courses in South Africa, empowering students and professionals for success.',
    foundingDate: '2009',
    foundingLocation: 'Bloemfontein, South Africa',
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
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
      streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
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
    ],
    knowsAbout: [
      'Trading Education',
      'Financial Markets',
      'Stock Market Training',
      'Forex Trading',
      'Library and Information Science',
      'Education Training Development',
      'Skills Development',
      'Professional Certifications',
      'South African Qualifications',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Education and Training Programs',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Trading Fundamentals',
            description: 'Beginner trading courses covering financial markets basics',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Advanced Trading Strategies',
            description: 'Professional-level trading education for experienced traders',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: 'Library and Information Science',
            description: 'Accredited LIS programmes for career advancement',
          },
        },
      ],
    },
    accreditation: [
      {
        '@type': 'Accreditation',
        name: 'ETDP SETA Accredited',
        accreditingBody: {
          '@type': 'Organization',
          name: 'Education, Training and Development Practices Sector Education and Training Authority',
          url: 'https://www.etdpseta.org.za',
        },
      },
      {
        '@type': 'Accreditation',
        name: 'QCTO Registered',
        accreditingBody: {
          '@type': 'Organization',
          name: 'Quality Council for Trades and Occupations',
          url: 'https://www.qcto.org.za',
        },
      },
      {
        '@type': 'Accreditation',
        name: 'SAQA Aligned',
        accreditingBody: {
          '@type': 'Organization',
          name: 'South African Qualifications Authority',
          url: 'https://www.saqa.org.za',
        },
      },
    ],
    award: [
      {
        '@type': 'Award',
        name: 'Accredited Education Provider South Africa',
        dateReceived: '2009',
        awarder: {
          '@type': 'Organization',
          name: 'ETDP SETA',
        },
      },
    ],
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    alumni: {
      '@type': 'Alumni',
      alumniOf: {
        '@id': `${BASE_URL}/#organization`,
      },
      description: 'Over 500+ graduates working in trading, finance, and library science across South Africa',
    },
  }
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Sozim Trading and Consultancy',
    description:
      'Accredited trading education, professional training courses, and career development programmes in South Africa.',
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

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'Sozim Trading and Consultancy',
    image:
      'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
    url: BASE_URL,
    telephone: '+27836680104',
    email: 'admin@sozim.co.za',
    priceRange: '$$',
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5',
    },
    areaServed: {
      '@type': 'Country',
      name: 'South Africa',
    },
    sameAs: [`${BASE_URL}/about`, `${BASE_URL}/contact`],
  }
}

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

export function getCourseSchema(params: {
  name: string
  description: string
  provider?: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: params.name,
    description: params.description,
    provider: {
      '@type': 'Organization',
      name: params.provider || 'Sozim Trading and Consultancy',
      url: BASE_URL,
    },
    url: params.url || `${BASE_URL}/courses`,
    inLanguage: 'en-ZA',
    coursePrerequisites:
      'No prior trading experience required for beginner courses. Basic computer literacy recommended.',
    educationalCredentialAwarded:
      'Certificate of Completion or Accredited Qualification (SAQA registered)',
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'online',
        courseWorkload: 'PT40H',
      },
      {
        '@type': 'CourseInstance',
        courseMode: 'face-to-face',
        location: 'Bloemfontein, South Africa',
        courseWorkload: 'PT40H',
      },
    ],
  }
}

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
    totalTime: 'P1D',
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Computer with internet access',
      },
      {
        '@type': 'HowToSupply',
        name: 'Valid email address',
      },
    ],
    step: params.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      itemListElement: {
        '@type': 'HowToDirection',
        text: step.text,
      },
    })),
  }
}

export function getSoftwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sozim Academic Library',
    description:
      'Access thousands of scholarly articles, theses, and research data from South African universities and international repositories.',
    url: `${BASE_URL}/library`,
    applicationCategory: 'EducationApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '89',
      bestRating: '5',
    },
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

export function getEventSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Sozim Trading Education Open Enrollment 2026',
    description:
      'Enroll in accredited trading courses and professional training programmes. Limited seats available for the 2026 academic year.',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      'https://schema.org/MixedEventAttendanceMode',
    location: [
      {
        '@type': 'Place',
        name: 'Sozim Trading and Consultancy Campus',
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
      {
        '@type': 'VirtualLocation',
        url: BASE_URL,
      },
    ],
    organizer: {
      '@id': `${BASE_URL}/#organization`,
    },
    performer: {
      '@id': `${BASE_URL}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/courses`,
      price: '0',
      priceCurrency: 'ZAR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-03-01',
    },
    image:
      'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
  }
}

export function getPersonSchema(params: {
  name: string
  jobTitle: string
  description: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: params.name,
    jobTitle: params.jobTitle,
    description: params.description,
    image: params.image,
    worksFor: {
      '@id': `${BASE_URL}/#organization`,
    },
    url: BASE_URL,
  }
}

export function getReviewSchema(params: {
  itemName: string
  itemUrl: string
  rating: number
  reviewBody: string
  authorName: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'EducationalOrganization',
      name: params.itemName,
      url: params.itemUrl,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: params.rating.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: params.authorName,
    },
    reviewBody: params.reviewBody,
    datePublished: params.datePublished || new Date().toISOString().split('T')[0],
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

export function getSpeakableSchema(params: {
  headline: string
  speakableText: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: params.headline,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: params.speakableText,
    },
  }
}

export function getArticleSchema(params: {
  headline: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  image?: string
  url?: string
  keywords?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${params.url || BASE_URL}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url || BASE_URL,
    },
    headline: params.headline,
    description: params.description,
    image: params.image || 'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
    author: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: params.author,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Sozim Trading and Consultancy',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
        width: 200,
        height: 100,
      },
    },
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    keywords: params.keywords?.join(', ') || 'trading education, South Africa, accredited courses',
    inLanguage: 'en-ZA',
    wordCount: 1500,
    articleSection: 'Education',
    articleBody: params.description,
  }
}

export function getWebPageSchema(params: {
  name: string
  description: string
  url?: string
  lastModified?: string
  breadcrumb?: { name: string; url: string }[]
  speakable?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${params.url || BASE_URL}#webpage`,
    url: params.url || BASE_URL,
    name: params.name,
    description: params.description,
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
    dateModified: params.lastModified || new Date().toISOString(),
    inLanguage: 'en-ZA',
    ...(params.speakable && {
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: params.speakable,
      },
    }),
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
  }
}

export function getSiteNavigationElementSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: items.map(item => item.name),
    url: items.map(item => item.url),
    hasPart: items.map(item => ({
      '@type': 'SiteNavigationElement',
      name: item.name,
      url: item.url,
    })),
  }
}

export function getProfessionalMembershipSchema(params: {
  organizationName: string
  membershipType: string
  memberSince?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    memberOf: {
      '@type': 'Organization',
      name: params.organizationName,
      url: params.organizationName.toLowerCase().replace(/\s+/g, '-'),
      description: `Member of ${params.organizationName}`,
    },
    membershipPoints: {
      '@type': 'MembershipProgram',
      name: params.membershipType,
      memberSince: params.memberSince || '2009',
    },
  }
}

export function getAlumniSchema(params: {
  alumniCount: string
  description: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    alumni: {
      '@type': 'Alumni',
      alumniOf: {
        '@id': `${BASE_URL}/#organization`,
      },
      description: params.description,
      numberOfAlumni: params.alumniCount,
    },
  }
}

export function getAggregateRatingSchema(params: {
  ratingValue: string
  reviewCount: string
  bestRating?: string
  worstRating?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: params.ratingValue,
      reviewCount: params.reviewCount,
      bestRating: params.bestRating || '5',
      worstRating: params.worstRating || '1',
      ratingExplanation: 'Average rating from student reviews across all courses',
    },
  }
}

export function getCourseInstanceSchema(params: {
  courseName: string
  courseUrl: string
  courseMode: string[]
  startDate?: string
  endDate?: string
  instructor?: string
  location?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CourseInstance',
    course: {
      '@type': 'Course',
      name: params.courseName,
      url: params.courseUrl,
      provider: {
        '@id': `${BASE_URL}/#organization`,
      },
    },
    courseMode: params.courseMode,
    startDate: params.startDate || '2026-03-01',
    endDate: params.endDate || '2026-12-31',
    instructor: params.instructor ? {
      '@type': 'Person',
      name: params.instructor,
    } : undefined,
    location: params.location ? {
      '@type': 'Place',
      name: params.location,
    } : undefined,
  }
}

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
    url: params.url || BASE_URL,
    recognizedBy: params.recognizedBy?.map(org => ({
      '@type': 'Organization',
      name: org,
    })) || [
      {
        '@type': 'Organization',
        name: 'ETDP SETA',
        url: 'https://www.etdpseta.org.za',
      },
      {
        '@type': 'Organization',
        name: 'QCTO',
        url: 'https://www.qcto.org.za',
      },
      {
        '@type': 'Organization',
        name: 'SAQA',
        url: 'https://www.saqa.org.za',
      },
    ],
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

export function getOrganizationSchemaScript() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Sozim Trading and Consultancy',
    alternateName: ['Sozim Trading', 'Sozim'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
      width: 200,
      height: 100,
    },
    image: [
      'https://ik.imagekit.io/vzofqg2fg/images/heroImage.jpg',
      'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
    ],
    description:
      'Sozim Trading and Consultancy offers accredited education, professional trading training, and career-focused courses in South Africa.',
    foundingDate: '2009',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop 4, Sunday School Building, 154 Charlotte Maxeke Street',
      addressLocality: 'Bloemfontein',
      addressRegion: 'Free State',
      postalCode: '9301',
      addressCountry: 'ZA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+27836680104',
      email: 'admin@sozim.co.za',
      contactType: 'customer service',
      availableLanguage: ['English', 'Afrikaans'],
    },
    sameAs: [
      'https://www.facebook.com/sozimtrading',
      'https://www.instagram.com/sozimtrading',
      'https://www.linkedin.com/company/sozim-trading',
    ],
    accreditation: [
      {
        '@type': 'Accreditation',
        name: 'ETDP SETA Accredited',
        accreditingBody: {
          '@type': 'Organization',
          name: 'ETDP SETA',
          url: 'https://www.etdpseta.org.za',
        },
      },
      {
        '@type': 'Accreditation',
        name: 'QCTO Registered',
        accreditingBody: {
          '@type': 'Organization',
          name: 'Quality Council for Trades and Occupations',
          url: 'https://www.qcto.org.za',
        },
      },
    ],
  }
}
