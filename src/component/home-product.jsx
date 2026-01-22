import React from 'react'
import Product1 from '../assets/images/img/1.webp'
import Product2 from '../assets/images/img/2.webp'
import Product3 from '../assets/images/img/3.webp'
import Product4 from '../assets/images/img/4.webp'
import Product5 from '../assets/images/img/5.webp'
import Product6 from '../assets/images/img/6.webp'
import Bed1 from '../assets/images/product/1.webp'
import Speaker from '../assets/images/product/speaker-1.jpg'
import Cooler from '../assets/images/product/cooler-1.webp'
import Fidge from '../assets/images/product/fige-1.avif'
import Laptop from '../assets/images/product/lap-1.jpg'
import Fan from '../assets/images/product/fan-1.avif'
import Mixie from '../assets/images/product/mixie-3.avif'
import King from '../assets/images/king/1.jpeg'
import { Link } from 'react-router-dom'
import ImageLoader from './image-loader'



const products = [
  { id: 1, title: 'COBRA ROMANCE', image: King, link: '/product' },
  { id: 2, title: 'Chair', image: Product2, link: '/product' },
  { id: 3, title: 'Table', image: Product3, link: '/product' },
  { id: 4, title: 'Lamp', image: Product4, link: '/product' },
  { id: 5, title: 'Frame', image: Product5, link: '/product' },
  { id: 6, title: 'Shelf', image: Product6, link: '/product' },
  { id: 7, title: 'Wood Table', image: Product2, link: '/product' },
  { id: 8, title: 'Stool', image: Product1, link: '/product' },
  { id: 9, title: 'Shelf', image: Product6, link: '/product' },
  { id: 10, title: 'Wood Table', image: Product2, link: '/product' },
  { id: 11, title: 'Stool', image: Product1, link: '/product' },
  { id: 12, title: 'Wood chair', image: Product4, link: '/product' },
  { id: 13, title: 'Mattress', image: Bed1, link: '/product' },
  { id: 14, title: 'Speaker', image: Speaker, link: '/product' },
  { id: 15, title: 'Cooler', image: Cooler, link: '/product' },
  { id: 16, title: 'Fidge', image: Fidge, link: '/product' },
  { id: 17, title: 'Laptop', image: Laptop, link: '/product' },
  { id: 18, title: 'Fan', image: Fan, link: '/product' },
  { id: 19, title: 'Mixie', image: Mixie, link: '/product' },
  { id: 20, title: 'Wood', image: Product1, link: '/product' },



]

function HomeProduct() {
  return (
    <section className='home_prodcut_sec'>
      <div className="container mx-auto">
        <div className="mb-3">
          <div className="text-2xl poppins-bold text-center text-slate-900 uppercase">Discover more near by you</div>
        </div>

        <div className="flex flex-wrap -mx-2">
          {products.map((item) => (
            <div key={item.id} className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 p-3">
              <div className="card product-card rounded-sm pb-2 relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-green-700 border-1 group">
                <ImageLoader className="product-img w-full transition-transform duration-300 group-hover:scale-105" src={item.image} alt={item.title} width="300" height="205" />
                <div className="cont text-center mt-2">
                  <div className="text-m poppins-semibold text-black">{item.title}</div>
                </div>
                <Link to={item.link} className="absolute inset-0 z-10"></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeProduct
