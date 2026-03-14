'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('shopFavorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const favoriteProducts = products.filter(p => favorites.includes(p.name))

  const removeFavorite = (productName: string) => {
    const updated = favorites.filter(f => f !== productName)
    setFavorites(updated)
    localStorage.setItem('shopFavorites', JSON.stringify(updated))
  }

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Your <span className="text-red-500">Favorites</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
            Your saved items for later. Click the heart to remove from favorites.
          </p>
        </motion.div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No favorites yet</h3>
            <p className="text-slate-500 mb-6">Start adding items to your favorites by clicking the heart icon on products.</p>
            <Link href="/shop">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Shop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {favoriteProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Card className="h-full border-slate-200/60 bg-white overflow-hidden rounded-[32px] transition-all duration-500 hover:shadow-2xl">
                  <div className="relative aspect-square bg-slate-100/50 overflow-hidden flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="w-4/5 h-4/5 object-contain"
                      width={600}
                      height={600}
                    />
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="absolute top-4 right-4 rounded-full h-10 w-10 shadow-xl"
                      onClick={() => removeFavorite(product.name)}
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
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
                      <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold shadow-xl">
                        Purchase Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/shop" className="text-blue-600 font-bold hover:underline">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}