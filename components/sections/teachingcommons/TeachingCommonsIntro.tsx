import { Card, CardContent } from '@/components/ui/card'

const coreFocusAreas = [
  'Facilitator and Student Advising',
  'Student Professional Development and Technology Access',
  'Academic Writing and Multi-Literacy Development',
]

const flagshipProgrammes = [
  {
    acronym: 'CCRD',
    name: 'Comprehensive Course (Re) Design Programs',
  },
  {
    acronym: 'FPOR',
    name: 'Formalised Peer Observation and Reflection Program',
  },
  {
    acronym: 'ASS',
    name: 'Accelerated Study Support',
  },
]

export default function TeachingCommonsIntro() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto py-16 px-4 space-y-16 max-w-4xl">
        {/* Welcome letter */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="text-xl md:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome to the Teaching Commons at Sozim
            </h2>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="space-y-5 text-base md:text-lg text-slate-600 leading-relaxed">
            <p>
              Innovation is at the center of teaching and learning activities
              at Sozim. The Teaching Commons (TC), also known as the Centre
              for Teaching and Learning, is an academic support centre which
              has a shared interest in supporting learning and teaching
              activities at Sozim.
            </p>
            <p>
              The TC at Sozim is committed to the college&rsquo;s philosophy
              of training and skills development - centered around creating
              a learning culture that directly improves job performance and
              contributes to organisational success.
            </p>
            <p>
              As Academic Manager, I welcome you to make use of the
              resources we have developed for the success of our students
              and staff.
            </p>
            <p>
              The mission of the TC at Sozim is to partner with academic
              schools to create transformative learning experiences by
              instilling critical thinking and bridging the gap between
              theory and practice for all our students.
            </p>
            <p>
              Rapid advancement in technology requires innovative teaching
              and learning. Students need to complete their knowledge,
              practical and work integrated modules on time and with
              identifiable graduate attributes that increase prospects of
              employability.
            </p>
            <p>
              We strive for partnership with all internal college
              stakeholders, including the broader society. We promote
              occupational based training and skills development, foster
              care, inclusivity and diversity for the betterment of society.
            </p>
            <p>
              The TC&rsquo;s core focus is on Facilitator and Student
              Advising, Student Professional Development and Technology
              Access, Academic Writing and Multi-Literacy Development.
              Academic schools and student success support flagship
              programmes include Comprehensive Course (Re) Design (CCRD)
              Programs, Formalised Peer Observation and Reflection (FPOR)
              Program; Accelerated Study Support (ASS).
            </p>
            <p>
              I encourage you to make use of the resources available at the
              TC. Let us continue to close the skills gap in the South
              African library and information services sector through
              innovative teaching and learning initiatives. Together, we can
              open up more career pathways for unemployed youth interested
              in information services. We can empower public and community
              libraries that are under-capacitated libraries and struggling
              to meet the community&rsquo;s information, digital and
              computer literacy needs.
            </p>
            <p>
              Thank you for being part of a team that transforms the future.
            </p>
          </div>

          <div className="pt-4 text-base text-slate-700">
            <p>Sincerely,</p>
            <p className="font-bold text-slate-900">Dr Mahlaga J Molepo</p>
            <p>Academic Manager</p>
          </div>
        </section>

        {/* Core Focus Areas */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Core Focus Areas
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreFocusAreas.map((area) => (
              <Card
                key={area}
                className="h-full border-slate-200/60 shadow-sm"
              >
                <CardContent className="p-6">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {area}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Flagship Programmes */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 md:gap-4">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
              Flagship Programmes
            </h3>
            <div className="h-1 flex-1 bg-slate-100 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flagshipProgrammes.map((programme) => (
              <Card
                key={programme.acronym}
                className="h-full border-slate-200/60 shadow-sm"
              >
                <CardContent className="p-6 space-y-1">
                  <p className="text-xs font-bold tracking-wide text-blue-600 uppercase">
                    {programme.acronym}
                  </p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {programme.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
