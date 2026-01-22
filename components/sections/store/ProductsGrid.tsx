'use client'

import Image from 'next/image'

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
        'https://ik.imagekit.io/vzofqg2fg/images/store/whitehoodie.jpg?updatedAt=1766078080543',
    },
  ]

  return (
    <div className="p-4 mt-16 mb-18">
      <div className="mx-auto lg:max-w-5xl max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-2xl hover:border-blue-600 transition-all relative"
            >
              <a className="block">
                <div className="aspect-[281/218] text-center bg-gray-50 overflow-hidden mx-auto rounded-b-2xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-5/6 h-full object-contain inline-block"
                    width={440}
                    height={500}
                  />
                </div>
              </a>

              <div className="p-4">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between gap-2 mt-6">
                  {/* Favorite icon */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 flex items-center justify-center rounded-full cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      className="fill-slate-800 inline-block"
                      viewBox="0 0 64 64"
                    >
                      <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"></path>
                    </svg>
                  </div>

                  <h4 className="text-sm sm:text-base text-slate-900 font-bold">
                    R{product.price}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
