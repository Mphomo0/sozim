'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'


export default function ProductsGrid() {
  const products = [
    {
      name: 'T-Shirt',
      price: '599.95',
      image:
        'https://ik.imagekit.io/vzofqg2fg/images/store/TSHIRT.jpg?updatedAt=1766078079788',
    },
    {
      name: 'Cap',
      price: '350',
      image:
        'https://ik.imagekit.io/vzofqg2fg/images/store/Cap.jpg?updatedAt=1766078080130',
    },
    {
      name: 'Black Hoodie',
      price: '699.95',
      image:
        'https://ik.imagekit.io/vzofqg2fg/images/store/BlackHoodie.jpg?updatedAt=1766078079955',
    },
    {
      name: 'Golf Shirt',
      price: '499.95',
      image:
        'https://ik.imagekit.io/vzofqg2fg/images/store/BlackHoodie.jpg?updatedAt=1766078079955',
    },
    {
      name: 'White Hoodie',
      price: '699.95',
      image:
        'https://ik.imagekit.io/vzofqg2fg/images/store/whitehoodie.jpg?updatedAt=1766080543',
    },
  ]

  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('shopFavorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const toggleFavorite = (productName: string) => {
    const updated = favorites.includes(productName)
      ? favorites.filter(f => f !== productName)
      : [...favorites, productName]
    setFavorites(updated)
    localStorage.setItem('shopFavorites', JSON.stringify(updated))
  }

  const isFavorite = (productName: string) => favorites.includes(productName)

  return (
    <div className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Premium <span className="text-blue-600">Apparel & Gear</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
            High-quality merchandise designed for comfort and style. Support Sozim in style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Card className="h-full border-slate-200/60 bg-white overflow-hidden rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group">
                {/* Image Container */}
                <div className="relative aspect-square bg-slate-100/50 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-4/5 h-4/5 object-contain transition-transform duration-700 group-hover:scale-110"
                    width={600}
                    height={600}
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="rounded-full h-12 w-12 shadow-xl hover:scale-110 transition-transform"
                      onClick={() => toggleFavorite(product.name)}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite(product.name) ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
                    </Button>
                    <Link href="/contact">
                      <Button size="icon" variant="default" className="rounded-full h-12 w-12 bg-white text-slate-900 shadow-xl hover:scale-110 transition-transform">
                        <ShoppingBag className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>

                  <Badge className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-slate-900 border-0 font-bold px-3 py-1 rounded-full shadow-sm">
                    NEW ARRIVAL
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="p-8">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                         {product.name}
                       </h3>
                       <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                         SOZIM OFFICIAL
                       </p>
                     </div>
                     <div className="text-right">
                       <p className="text-xl font-extrabold text-slate-900">
                         R{product.price}
                       </p>
                     </div>
                   </div>

                   <Link href="/contact" className="w-full">
                     <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold group/btn shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
                       Purchase Now
                       <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                     </Button>
                   </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
           <p className="text-slate-400 font-medium">Looking for bulk orders? <a href="/contact" className="text-blue-600 font-bold hover:underline">Contact our sales team</a></p>
           <Link href="/favorites" className="text-slate-400 font-medium hover:text-red-500 flex items-center gap-2">
             <Heart className="h-4 w-4" />
             View Favorites
           </Link>
        </div>
      </div>
    </div>
  )
}
