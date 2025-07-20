import React from 'react'

function HomeBanner() {
  return (
    <section className='home-banner'>
        <div className="container mx-auto">
            <div className="flex justify-center">
                <div className="w-full md:w-1/3 px-2">
                    <div className="content">
                        <div className='text-center text-4xl poppins-bold text-white'>Find Best Products Around You.</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default HomeBanner