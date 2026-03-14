'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, GraduationCap, School, BookOpen } from 'lucide-react'
import { motion } from 'motion/react'

export default function ContactLearningSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <GraduationCap className="w-12 h-12 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Pursue Your Qualifications Through <span className="text-blue-600">Contact Learning</span>
          </h2>
          <p className="mt-6 text-xl text-slate-500 font-medium leading-relaxed">
            Our campus-based programmes offer direct interaction with educators and peers, fostering a dynamic learning environment.
          </p>
        </motion.div>

        <div className="grid gap-12 max-w-6xl mx-auto">
          {/* Section: Higher Education */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <School className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">University Accredited & Skills</h3>
              <div className="h-1 flex-1 bg-slate-200/50 rounded-full" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  title: "Library Assistant", 
                  href: "/courses/jd7aetgjc0qs1p2x65b4dz8nax82e1dp",
                  desc: "Comprehensive training for modern library management."
                },
                { 
                   title: "Learning and Development Facilitator", 
                   href: "/courses/jd73pdzr7by2fg8npqb4zvw5mh82fsw1",
                   desc: "Master the art of educational facilitation."
                },
                { 
                  title: "Assessment Practitioner", 
                  href: "/courses/jd74ajdjhj01hdrg48whbak7fd82ezzm",
                  desc: "Become a certified assessor in your field."
                }
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className="group">
                  <Card className="h-full border-slate-200/60 bg-white hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-[24px] overflow-hidden">
                    <CardContent className="p-8">
                      <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 font-medium mb-6 line-clamp-2">
                        {item.desc}
                      </p>
                      <div className="flex items-center text-blue-600 font-bold gap-2">
                        View Details <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Section: Skills Programmes */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">ETDP SETA Skills Programmes</h3>
              <div className="h-1 flex-1 bg-slate-200/50 rounded-full" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  title: "Conduct Outcomes-Based Assessment", 
                  href: "/courses/jd7brhpjdrhzhnpb4kkyjpfnbs82fxmm",
                  desc: "Essential skills for professional outcomes-based auditing."
                },
                { 
                  title: "Facilitate Learning Methodologies", 
                  href: "/courses/jd73pdzr7by2fg8npqb4zvw5mh82fsw1",
                  desc: "Advanced techniques for diverse learning groups."
                },
                { 
                  title: "Conduct Moderation of Assessment", 
                  href: "/courses/jd74ajdjhj01hdrg48whbak7fd82ezzm",
                  desc: "Quality assurance for educational standards."
                }
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className="group">
                  <Card className="h-full border-slate-200/60 bg-white hover:border-slate-900 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-[24px] overflow-hidden">
                    <CardContent className="p-8">
                      <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 font-medium mb-6 line-clamp-2">
                        {item.desc}
                      </p>
                      <div className="flex items-center text-slate-900 font-bold gap-2">
                        View Details <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 p-12 bg-slate-900 rounded-[40px] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Ready to start your journey?</h3>
          <p className="text-slate-300 text-lg font-medium mb-10 max-w-2xl mx-auto">
            Contact our admissions office today to secure your place in our next intake.
          </p>
          <Link 
            href="/contact"
            className="inline-flex h-16 items-center justify-center rounded-2xl bg-white px-10 text-lg font-extrabold text-slate-900 shadow-xl hover:shadow-white/10 hover:-translate-y-1 transition-all duration-300"
          >
            Apply Now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
