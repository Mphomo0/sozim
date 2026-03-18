'use client'

import PageHeader from '@/components/global/PageHeader'
import { SearchHeader } from '@/components/sections/library/search-header'
import { SearchLayout, type SearchLayoutRef } from '@/components/sections/library/search-layout'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Database, AlertTriangle } from 'lucide-react'
import { toast } from 'react-toastify'
import FAQSection from '@/components/global/FAQSection'
import { getSoftwareAppSchema, getFAQSchema } from '@/lib/seo/schemas'

const libraryFAQs = [
  {
    question: 'What is the Sozim Academic Library?',
    answer:
      'The Sozim Academic Library is a digital research platform that provides access to thousands of scholarly articles, theses, dissertations, and research data. Our library aggregates content from leading South African universities and reputable international repositories, supporting students and researchers in their academic pursuits.',
  },
  {
    question: 'How do I access the Sozim Academic Library?',
    answer:
      'The library is accessible to all registered Sozim students and visitors through our website. Navigate to the Library page and use the search function to browse our collection. Some resources may require free registration or may link to external repositories for full-text access. The library database is regularly updated with new content.',
  },
  {
    question: 'What types of resources are available in the library?',
    answer:
      'Our library covers a wide range of academic disciplines including trading and finance, library and information science (LIS), education training and development (ETD), business management, and general academic research. Available formats include journal articles, conference papers, theses, dissertations, and research datasets.',
  },
  {
    question: 'Is the Sozim Academic Library free to use?',
    answer:
      'Yes, the library search and discovery tool is completely free to use. Some linked resources from external repositories may have their own access requirements. We continuously work to expand our partnerships and provide greater access to open-access academic resources for South African students and researchers.',
  },
  {
    question: 'Can I download research papers from the library?',
    answer:
      'Download availability depends on the specific resource and its licensing terms. Many open-access papers can be downloaded directly, while others may link to external repositories where you can access the full text. We always respect copyright and intellectual property rights associated with each resource.',
  },
  {
    question: 'How often is the library database updated?',
    answer:
      'Our library database is regularly updated through automated harvesting from academic repositories. We sync with South African university repositories and international academic databases on a routine schedule. This ensures our users have access to the latest research and publications across all covered disciplines.',
  },
]

type CategoryType = 'all' | 'research' | 'articles' | 'theses' | 'elis'

export default function LibraryPageClient() {
  const searchLayoutRef = useRef<SearchLayoutRef>(null)
  const [harvesting, setHarvesting] = useState(false)
  const [harvestStatus, setHarvestStatus] = useState<'idle' | 'harvesting' | 'error' | 'success'>('idle')

  const softwareAppSchema = getSoftwareAppSchema()
  const faqSchema = getFAQSchema(libraryFAQs)

  const handleSearch = (query: string, category: CategoryType) => {
    searchLayoutRef.current?.handleSearch(query, category)
  }

  const handleHarvestNow = async () => {
    setHarvesting(true)
    setHarvestStatus('harvesting')
    try {
      const response = await fetch('/api/harvest-now', { method: 'POST' })
      const data = await response.json()
      if (data.success) {
        setHarvestStatus('success')
        toast.success('Library data loaded successfully!')
        setTimeout(() => {
          searchLayoutRef.current?.handleSearch('', 'all')
        }, 1000)
      } else {
        setHarvestStatus('error')
        toast.error(data.error || 'Failed to load library data')
      }
    } catch (err) {
      setHarvestStatus('error')
      toast.error('Failed to load library data. Please try again.')
    } finally {
      setHarvesting(false)
      setTimeout(() => setHarvestStatus('idle'), 5000)
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHeader
        title="Academic Library"
        details="Access thousands of scholarly articles, theses, and research data from leading South African universities and international repositories."
      />
      <SearchHeader onSearch={handleSearch} />
      <SearchLayout
        ref={searchLayoutRef}
        noDataAction={
          <div className="max-w-md mx-auto text-center space-y-6 py-8">
            <Database className="w-16 h-16 mx-auto text-blue-900 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Library Database is Empty
            </h3>
            <p className="text-gray-600 mb-6">
              No articles, theses, or research data have been loaded yet. Load the library to access thousands of academic resources.
            </p>
            {harvestStatus === 'harvesting' && (
              <div className="flex items-center justify-center gap-3 text-blue-600 mb-6">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Harvesting data from repositories...</span>
              </div>
            )}
            {harvestStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600 mb-6 bg-red-50 px-4 py-3 rounded-lg">
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                <span>Harvesting failed. Please try again.</span>
              </div>
            )}
            {harvestStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600 mb-6 bg-green-50 px-4 py-3 rounded-lg">
                <Database className="w-5 h-5" aria-hidden="true" />
                <span>Data loaded successfully! Searching...</span>
              </div>
            )}
            <Button
              onClick={handleHarvestNow}
              disabled={harvesting}
              className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {harvesting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Harvesting...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5 mr-2" aria-hidden="true" />
                  Load Library Data
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              This will fetch approximately 360 records from multiple repositories. It may take 30-60 seconds.
            </p>
          </div>
        }
      />
      <FAQSection
        title="Frequently Asked Questions About the Academic Library"
        faqs={libraryFAQs}
      />
    </>
  )
}
