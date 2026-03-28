const BASE_URL = 'https://www.sozim.co.za'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Sozim Trading and Consultancy',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
      width: 200,
      height: 100,
    },
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

export function getOrganizationSchemaScript() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Sozim Trading and Consultancy',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: 'https://ik.imagekit.io/vzofqg2fg/images/SozimLogoWhite.webp',
      width: 200,
      height: 100,
    },
    description:
      'Sozim Trading and Consultancy offers accredited education, professional trading training, and career-focused courses in South Africa.',
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
  }
}
