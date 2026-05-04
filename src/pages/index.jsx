import React from 'react'
import HomeBanner from '../component/home-banner'
import HomeProduct from '../component/home-product'
import HomeFeatures from '../component/home-features'
import SEO from '../component/SEO'

const Home = () => {
  return (
    <main>
      <SEO 
        title="Eacyclic – Buy Products Online in Kerala | Best Shopping Website in India" 
        description="Shop online with Eacyclic. Find the best products around you in Kerala and across India. Easy shopping, fast delivery. Buy products online today!" 
        keywords="Eacyclic, online shopping, Kerala, India, buy products online, e-commerce"
      />
      <HomeBanner />
      <HomeProduct />
      <HomeFeatures />
    </main>
  )
}

export default Home