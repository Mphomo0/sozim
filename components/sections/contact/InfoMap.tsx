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
    <section className="container mx-auto sm:px-6 lg:px-8">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <ContactForm />

            {/* Map & Additional Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visit Our Campus</CardTitle>
                  <CardDescription>
                    Located in the heart of Bloemfontein with easy access to
                    public transport
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                    <div className="flex h-full items-center justify-center">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3485.625462879269!2d26.217421500000004!3d-29.116736799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e8fc57e359898db%3A0x1748bde291c2fd64!2sSozim!5e0!3m2!1sen!2sza!4v1766078608106!5m2!1sen!2sza"
                        width="100%"
                        height="450"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="item-1"
                    className="w-full"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        When do applications open?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Applications are open year-round with intakes in
                          January, April, July, and October.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        How long does the application process take?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Most applications are processed within 5-7 business
                          days after all documents are submitted.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        Do you offer payment plans?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Yes, we offer flexible payment options and financial
                          aid for qualifying students.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        Can I schedule a campus tour?
                      </AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Absolutely! Contact us to arrange a personalized
                          campus tour with one of our student advisors.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
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
