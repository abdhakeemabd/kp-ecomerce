import React, { useState } from 'react';
import Slider from "react-slick";
import { PiShareFat } from "react-icons/pi";
import { BiSolidLike, BiLike, BiCart, BiSolidCart } from "react-icons/bi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

function HomeFeatures() {
  const { products } = useProducts();
  const [likes, setLikes] = useState({});
  const [carts, setCarts] = useState({});

  // Show a subset of products as "Best Products"
  const featureProducts = products.slice(0, 10);
  
  const toggleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleCart = (id) => {
    setCarts(prev => ({ ...prev, [id]: !prev[id] }));
  };


  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1199, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className='home_feature_sec py-8 overflow-hidden'>
      <div className="container mx-auto">
        <div className='text-2xl poppins-bold text-center text-slate-900 uppercase'>Best Product</div>
        <div className="features_slider mt-4">
          <Slider {...settings}>
            {featureProducts.map(item => (
              <div className='px-3 features-card rounded-sm pb-2 relative overflow-hidden' key={item.id}>
                <div className='feature-img-card'>
                  <img className='feature-img w-full' src={item.image || (item.gallery && item.gallery[0])} alt={item.title} />
                </div>
                <div className="cont px-3 mt-2">
                  <div className='text-xl poppins-semibold'>{item.title}</div>
                  <div className='text-md line-clamp-1'>{item.content || item.description}</div>
                  <div className='text-md poppins-semibold'>₹ {item.offerPrice || item.price}</div>
                  <div className="bottom-card flex justify-between gap-3 mt-3">
                    <div className="flex gap-3 text-lg text-gray-800">
                      <button className='hover:text-blue-500 relative z-2' onClick={() => toggleLike(item.id)}>
                        {likes[item.id] ? <BiSolidLike className="text-red-500" /> : <BiLike />}
                      </button>
                      <button className='hover:text-blue-500 relative z-2' onClick={() => toggleCart(item.id)}>
                        {carts[item.id] ? <BiSolidCart className="text-orange-500" /> : <BiCart />}
                      </button>
                      <button className='hover:text-blue-500 relative z-2' onClick={() => navigator.share ? navigator.share({
                        title: item.title,
                        text: item.content || item.description,
                        url: window.location.href
                      }) : alert("Share not supported on this browser.")}>
                        <PiShareFat />
                      </button>
                    </div>
                    <div>{item.count || item.stock || 0} Views</div>
                  </div>
                </div>
                <Link
                  to={`/product-view/${item.id}`}
                  state={{
                    product: {
                      ...item,
                      offerPrice: item.offerPrice || item.price,
                      oldPrice: item.oldPrice || (parseInt(item.offerPrice || item.price) + 2000),
                      offer: item.offer || '10%',
                      gallery: item.gallery || [item.image],
                      description: item.description || item.content,
                      subDescription: item.subDescription || item.content,
                      subContent: item.subContent || item.content
                    }
                  }}
                  className='absolute inset-0 z-1'
                ></Link>
              </div>
            ))}
          </Slider>
        </div>

      </div>
    </section>
  );
}

export default HomeFeatures;
