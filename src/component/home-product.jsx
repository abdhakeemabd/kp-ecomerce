import React from 'react'
import Product1 from '../assets/images/img/1.jpg'
import Product2 from '../assets/images/img/2.jpg'
import Product3 from '../assets/images/img/3.jpg'
import Product4 from '../assets/images/img/4.jpg'
import Product5 from '../assets/images/img/5.jpg'
import Product6 from '../assets/images/img/6.jpg'



const products = [
  { id: 1, title: 'Wood', image: Product1, link: '/' },
  { id: 2, title: 'Chair', image: Product2, link: '/' },
  { id: 3, title: 'Table', image: Product3, link: '/' },
  { id: 4, title: 'Lamp', image: Product4, link: '/' },
  { id: 5, title: 'Frame', image: Product5, link: '/' },
  { id: 6, title: 'Shelf', image: Product6, link: '/' },
  { id: 7, title: 'Wood Table', image: Product2, link: '/' },
  { id: 8, title: 'Stool', image: Product1, link: '/' },
  { id: 9, title: 'Shelf', image: Product6, link: '/' },
  { id: 10, title: 'Wood Table', image: Product2, link: '/' },
  { id: 11, title: 'Stool', image: Product1, link: '/' },
  { id: 12, title: 'Wood chair', image: Product4, link: '/' },

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
              <div className="card product-card rounded-sm pb-2 relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img className="product-img w-full" src={item.image} alt={item.title} />
                <div className="cont text-center mt-2">
                  <div className="text-m poppins-semibold text-black">{item.title}</div>
                </div>
                <a href={item.link} className="absolute inset-0 z-10"></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HomeProduct
