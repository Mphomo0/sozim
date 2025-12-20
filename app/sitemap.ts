import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.sozim.co.za'
  const lastModified = new Date()

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-pathway`,
      lastModified,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/campus`,
      lastModified,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact-learning`,
      lastModified,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/call-me-back`,
      lastModified,
      priority: 0.5,
    },
  ]
}
