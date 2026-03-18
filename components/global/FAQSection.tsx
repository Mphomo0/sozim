'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

const FAQSection = forwardRef<HTMLDivElement, FAQSectionProps>(
  ({ faqs, title }, ref) => {
    return (
      <section ref={ref} className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {title && (
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                {title}
              </h2>
              <p className="text-xl text-slate-600">
                Frequently asked questions about Sozim Trading and Consultancy
              </p>
            </div>
          )}
          <Accordion.Root
            type="single"
            collapsible
            className="space-y-4"
          >
            {faqs.map((faq, index) => (
              <Accordion.Item
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between p-6 text-left group">
                    <span className="text-lg font-semibold text-slate-900 pr-4 group-hover:text-blue-700 transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className="w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                      aria-hidden="true"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden">
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>
    )
  }
)

FAQSection.displayName = 'FAQSection'

export default FAQSection
export type { FAQItem }
