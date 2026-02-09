import React from 'react'
import { Link } from 'react-router-dom'
import ImageLoader from './image-loader'
import { useProducts } from '../context/ProductContext'

function HomeProduct() {
  const { products } = useProducts();

  // Show a subset of products for the home page (e.g., first 20 or latest)
  // If there are many products, we might want to slice them
  const displayProducts = products.length > 0 ? products : [];

  return (
    <section className='home_prodcut_sec'>
      <div className="container mx-auto">
        <div className="mb-3">
          <div className="text-2xl poppins-bold text-center text-slate-900 uppercase">Discover more near by you</div>
        </div>
        <div className="flex flex-wrap -mx-2">
          {displayProducts.map((item) => (
            <div key={item.id} className="w-full lg:w-1/4 md:w-1/3 sm:w-1/2 p-3">
              <div className="card product-card rounded-sm pb-2 relative overflow-hidden hover:shadow-lg transition-shadow duration-300 border-[#ebebec] border-1 group h-full">
                <ImageLoader 
                  className="product-img w-full transition-transform duration-300 group-hover:scale-105" 
                  src={item.image || (item.gallery && item.gallery[0])} 
                  alt={item.title} 
                  width="300" 
                  height="205" 
                />
                <div className="cont text-center mt-2">
                  <div className="text-m poppins-semibold text-black">{item.title}</div>
                  <div className="mt-2 flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      {item.offer && (
                        <span className="text-lg text-green-600 font-light font-medium">-{item.offer.replace(/[^0-9]/g, '')}%</span>
                      )}
                      <div className="flex items-center text-black">
                        <span className="text-lg me-1 font-medium">₹</span>
                        <span className="text-lg font-bold leading-none">{item.offerPrice || item.price}</span>
                      </div>
                    </div>
                    {item.oldPrice && (
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        M.R.P.: <span className="line-through">₹{item.oldPrice}</span>
                      </div>
                    )}
                  </div>
                  </div>
                <Link
                  to={`/product-view/${item.id}`}
                  state={{ product: item }}
                  className="absolute inset-0 z-10"
                ></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


export default HomeProduct
