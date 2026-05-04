import React from 'react'
import HomeBanner from '../component/home-banner'
import HomeProduct from '../component/home-product'
import HomeFeatures from '../component/home-features'
import SEO from '../component/SEO'

const Home = () => {
  return (
    <main>
      <SEO 
        title="Best Online Shopping in Kerala & India" 
        description="Eacyclic is an online shopping platform in Kerala & India. Buy products easily in one click with fast delivery." 
        keywords="eacyclic, online shopping Kerala, buy products Malappuram, easy click shopping, e-commerce India"
      />
      <HomeBanner />
      <HomeProduct />
      <HomeFeatures />
    </main>
  )
}

export default Home