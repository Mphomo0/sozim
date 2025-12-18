import Image from 'next/image'

const CampusCard = () => {
  return (
    <div className="max-w-4xl mx-auto overflow-hidden border border-gray-400 shadow-sm font-sans mt-18 mb-18">
      {/* Top Header Bar */}
      <div className="bg-[#53565a] py-3">
        <h2 className="text-white text-center font-bold tracking-wider text-lg">
          BLOEMFONTEIN (MAIN CAMPUS)
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Image */}
        <div className="relative h-64 md:h-auto min-h-[300px]">
          <Image
            src="https://ik.imagekit.io/vzofqg2fg/images/temp.jpg"
            alt="Sozim Picture"
            className="w-auto h-auto object-cover"
            width={800}
            height={800}
            unoptimized
          />
        </div>

        {/* Right Side: Information */}
        <div className="bg-white p-8 flex flex-col justify-center text-[#53565a]">
          <p className="italic text-sm mb-4 leading-tight">
            Contact Learning Campus & Distance Learning Support Centre
          </p>

          <h3 className="font-extrabold text-lg mb-6 leading-snug uppercase">
            School of Arts and Humanities, School of Education, ETDP SETA Skills
            Programmes
          </h3>

          <div className="space-y-1 text-sm md:text-base">
            <p className="font-medium">
              Sozim Higher Education - Bloemfontein Campus
            </p>
            <p>
              Shop 4, Sunday School Building, 154 Charlotte Maxeke Street,
              Bloemfontein
            </p>

            <div className="pt-4 space-y-1">
              <p>(+27) 83 668 0104</p>
              <p>(+27) 72 302 3929</p>
              <p className="text-blue-600 hover:underline cursor-pointer">
                admin@sozim.co.za
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampusCard
