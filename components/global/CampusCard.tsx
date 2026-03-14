import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail } from 'lucide-react'

const CampusCard = () => {
  return (
    <div className="max-w-6xl mx-auto overflow-hidden bg-white border border-slate-200 shadow-2xl rounded-[40px] font-sans mt-24 mb-24 relative group">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 h-32 w-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Image with overlay */}
        <div className="relative h-96 lg:h-auto overflow-hidden">
          <Image
            src="https://ik.imagekit.io/vzofqg2fg/images/temp.jpg"
            alt="Sozim Bloemfontein Campus"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            width={1200}
            height={800}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-8 left-8 text-white">
            <Badge className="mb-4 bg-blue-600 text-white border-0 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide shadow-lg">
              MAIN CAMPUS
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-lg">
              BLOEMFONTEIN
            </h2>
          </div>
        </div>

        {/* Right Side: Information */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
          <div className="space-y-8">
            <div>
              <p className="inline-block text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 border-b-2 border-blue-100 pb-1">
                Contact Learning Campus & Distance Learning Support Centre
              </p>

              <h3 className="font-extrabold text-2xl md:text-3xl text-slate-900 leading-tight mb-6">
                School of Arts and Humanities, <br className="hidden md:block" />
                School of Education, <br className="hidden md:block" />
                ETDP SETA Skills Programmes
              </h3>
            </div>

            <div className="space-y-6 text-slate-600">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg mb-1">
                    Sozim Higher Education
                  </p>
                  <p className="text-base font-medium leading-relaxed max-w-sm">
                    Shop 4, Sunday School Building, <br />
                    154 Charlotte Maxeke Street, Bloemfontein
                  </p>
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-700 font-bold group/link">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="cursor-pointer hover:text-blue-600 transition-colors">(+27) 83 668 0104</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 font-bold group/link">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="cursor-pointer hover:text-blue-600 transition-colors">(+27) 72 302 3929</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-blue-600 font-bold group/link">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:admin@sozim.co.za" className="underline underline-offset-4 decoration-2 decoration-blue-200 hover:decoration-blue-500 transition-all">
                    admin@sozim.co.za
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampusCard
