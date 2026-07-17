import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, TrendingUp, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function HomeBanner() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const popularTags = ['Furniture', 'Electronics', 'Grocery', 'Appliances']

  return (
    <section className='home-banner relative overflow-hidden flex items-center justify-center'>
      {/* Decorative Blur Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-4xl md:text-6xl font-black text-white leading-tight mb-6 drop-shadow-md'>
              Eacyclic – Shop the Best <br /> 
              <span className="text-orange-500">Local & National</span> Products
            </h1>
            <p className='text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed'>
              Connecting Kerala and India with a single click. Discover quality products delivered right to your doorstep.
            </p>
          </motion.div>

          {/* Premium Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-2xl mx-auto mb-8"
          >
            <form onSubmit={handleSearch} className="group flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl focus-within:ring-2 focus-within:ring-orange-500/50 transition-all duration-300">
              <div className="flex items-center flex-1 px-4">
                <Search className="w-5 h-5 text-orange-500 mr-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for furniture, electronics, or more..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-300 py-3 md:py-4 text-lg outline-none"
                />
              </div>
              <button 
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30 active:scale-95"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Popular Tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="text-gray-300 text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" /> Popular:
            </span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/product?category=${tag}`)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-4 py-1.5 rounded-full transition-all duration-300 hover:border-orange-500/50"
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* Conditional Prediction Banner Button */}
          {new Date() < new Date('2026-07-20T00:00:00') && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex justify-center"
            >
              <button
                onClick={() => navigate('/prediction')}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-bold py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.7)] hover:scale-105 transition-all duration-300"
              >
                <Trophy className="w-5 h-5 text-yellow-200 group-hover:rotate-12 transition-transform" />
                <span>Predict World Cup 2026 Winner</span>
                <span className="absolute -top-4 -right-4 bg-green-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider animate-bounce shadow-lg shadow-green-500/40 border-2 border-white">
                  Win ₹500 Voucher!
                </span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeBanner