'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ContactForm from './ContactForm'

export default function InfoMap() {
  return (
    <section className="container mx-auto sm:px-6 lg:px-8 mb-12">
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <ContactForm />

            {/* Map & Additional Info */}
            <div className="space-y-8">
              <Card className="border-slate-200/60 bg-white shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    Visit Our Campus
                  </CardTitle>
                  <CardDescription className="text-base text-slate-500 font-medium">
                    Located in the heart of Bloemfontein with easy access to
                    public transport
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3485.625462879269!2d26.217421500000004!3d-29.116736799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e8fc57e359898db%3A0x1748bde291c2fd64!2sSozim!5e0!3m2!1sen!2sza!4v1766078608106!5m2!1sen!2sza"
                      title="Sozim Trading and Consultancy campus location on Google Maps — Shop 4, Sunday School Building, 154 Charlotte Maxeke Street, Bloemfontein, South Africa"
                      width="100%"
                      height="100%"
                      className="min-h-[400px]"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 bg-white shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100">
                  <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    className="w-full space-y-4"
                  >
                    {[
                      {
                        val: "item-1",
                        q: "When do applications open?",
                        a: "Applications are open year-round with intakes in January, April, July, and October. Secure your spot in our next intake today."
                      },
                      {
                        val: "item-2",
                        q: "How long does the application process take?",
                        a: "Most applications are processed within 5-7 business days after all required documents are submitted. You'll receive updates via email."
                      },
                      {
                        val: "item-3",
                        q: "Do you offer payment plans?",
                        a: "Yes, we offer flexible payment options and financial aid for qualifying students. Speak to our finance office for tailored solutions."
                      },
                      {
                        val: "item-4",
                        q: "Can I schedule a campus tour?",
                        a: "Absolutely! Contact us using the form on this page to arrange a personalized campus tour with one of our expert student advisors."
                      }
                    ].map((item) => (
                      <AccordionItem key={item.val} value={item.val} className="border border-slate-100 rounded-2xl px-6 bg-slate-50/50 hover:bg-white transition-all duration-300">
                        <AccordionTrigger className="text-left font-bold text-slate-800 hover:text-blue-700 hover:no-underline text-lg py-5">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-base leading-relaxed pb-5 font-medium">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
