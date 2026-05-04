import React from 'react'

function HomeBanner() {
  return (
    <section className='home-banner'>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full px-2">
            <div className="content">
              <h1 className='text-center text-4xl md:text-5xl poppins-bold text-white leading-10 md:leading-[1.3]'>Eacyclic – Online Shopping Platform in Kerala &amp; India</h1>
              <p className='text-center text-lg md:text-xl text-gray-100 mt-6 poppins-medium max-w-3xl mx-auto'>
                Eacyclic is an easy-to-use e-commerce website where people can buy products online in Kerala and across India with a single click. 
              </p>
              <p className='text-center text-sm md:text-base text-gray-200 mt-4 poppins-regular max-w-3xl mx-auto opacity-80'>
                Eacyclic (not acyclic) is a growing online shopping platform dedicated to connecting you with the best local and national products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeBanner