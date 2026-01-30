import React from 'react'

function HomeBanner() {
  return (
    <section className='home-banner'>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full px-2">
            <div className="content">
              <div className='text-center text-3xl  md:text-4xl poppins-bold text-white leading-8 leading-10 md:leading-13 '>Your neighborhood. <br /> Endless discoveries.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeBanner