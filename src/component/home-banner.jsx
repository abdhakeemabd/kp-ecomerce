import React from 'react'

function HomeBanner() {
  return (
    <section className='home-banner'>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full px-2">
            <div className="content">
              <h1 className='text-center text-4xl md:text-5xl poppins-bold text-white leading-10 md:leading-[1.3]'>Welcome to Eacyclic</h1>
              <p className='text-center text-lg md:text-xl text-gray-100 mt-6 poppins-medium max-w-3xl mx-auto'>
                Experience the magic of Eacyclic: Buy products near you in one click. Eacyclic is your trusted online shopping platform in Kerala & India. When you choose Eacyclic, you choose convenience, quality, and speed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeBanner