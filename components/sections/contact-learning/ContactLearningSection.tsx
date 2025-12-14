'use client'

import Link from 'next/link'

export default function ContactLearningSection() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-center text-2xl font-semibold mb-8">
        The following qualifications can be pursued through contact learning in
        South Africa
      </h2>

      {/* Contact Learning */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Contact Learning
        </h3>
        <ul className="list-disc list-inside text-center space-y-2 text-black">
          <li>
            <Link
              href="/courses/692ea8739f5f634ccd8948a9"
              className="hover:underline"
            >
              Library Assistant
            </Link>
          </li>
        </ul>
      </div>

      {/* School of Education */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-center">
          School of Education
        </h3>
        <ul className="list-disc list-inside text-center space-y-2 text-black">
          <li>
            <Link
              href="/courses/692eaac59f5f634ccd8948bb"
              className="hover:underline"
            >
              Learning and Development Facilitator
            </Link>
          </li>
          <li>
            <Link
              href="/courses/692eabb39f5f634ccd8948c9"
              className="hover:underline"
            >
              Assessment Practitioner
            </Link>
          </li>
        </ul>
      </div>

      {/* ETDP SETA Skills Programmes */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-center">
          ETDP SETA Skills Programmes
        </h3>
        <ul className="list-disc list-inside text-center space-y-2 text-black">
          <li>
            <Link
              href="/courses/692eacec9f5f634ccd8948df"
              className="hover:underline"
            >
              Conduct Outcomes-Based Assessment
            </Link>
          </li>
          <li>
            <Link
              href="/courses/692eaac59f5f634ccd8948bb"
              className="hover:underline"
            >
              Facilitate Learning Using a Variety of Given Methodologies
            </Link>
          </li>
          <li>
            <Link
              href="/courses/692eabb39f5f634ccd8948c9"
              className="hover:underline"
            >
              Conduct Moderation of Outcomes-Based Assessment
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}
