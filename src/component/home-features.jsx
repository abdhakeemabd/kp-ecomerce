import React, { useState } from 'react';
import Slider from "react-slick";
import { PiShareFat } from "react-icons/pi";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { BiCart, BiSolidCart } from "react-icons/bi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Img1 from '../assets/images/img/1.webp';
import Img2 from '../assets/images/img/2.webp';
import Img3 from '../assets/images/img/3.webp';
import Img4 from '../assets/images/img/4.webp';
import Img5 from '../assets/images/img/5.webp';
import Img6 from '../assets/images/img/6.webp';
import { Link } from 'react-router-dom';

const featureData = [
  { id: 1, title: "Wood", text: "lorem content", price: "10000", count: 123, image: Img1 },
  { id: 2, title: "Metal", text: "lorem content", price: "10000", count: 143, image: Img2 },
  { id: 3, title: "Glass", text: "lorem content", price: "10000", count: 23, image: Img3 },
  { id: 4, title: "Glass", text: "lorem content", price: "10000", count: 53, image: Img4 },
  { id: 5, title: "Glass", text: "lorem content", price: "10000", count: 63, image: Img5 },
  { id: 6, title: "Glass", text: "lorem content", price: "10000", count: 83, image: Img6 },
];

function HomeFeatures() {
  const [likes, setLikes] = useState({});
  const [carts, setCarts] = useState({});
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
            {featureData.map(item => (
              <div className='px-3 features-card rounded-sm pb-2 relative overflow-hidden' key={item.id}>
                <div className='feature-img-card'>
                  <img className='feature-img' src={item.image} alt={item.title} />
                </div>
                <div className="cont px-3 mt-2">
                  <div className='text-xl poppins-semibold'>{item.title}</div>
                  <div className='text-md'>{item.text}</div>
                  <div className='text-md poppins-semibold'>₹ {item.price}</div>
                  <div className="bottom-card flex justify-between gap-3 mt-3">
                    <div className="flex gap-3 text-lg text-gray-800">
                      <button className='hover:text-blue-500 relative z-2' onClick={() => toggleLike(item.id)}>
                        {likes[item.id] ? <BiSolidLike /> : <BiLike />}
                      </button>
                      <button className='hover:text-blue-500 relative z-2' onClick={() => toggleCart(item.id)}>
                        {carts[item.id] ? <BiSolidCart /> : <BiCart />}
                      </button>
                      <button className='hover:text-blue-500 relative z-2' onClick={() => navigator.share ? navigator.share({
                        title: item.title,
                        text: item.text,
                        url: window.location.href
                      }) : alert("Share not supported on this browser.")}>
                        <PiShareFat />
                      </button>
                    </div>
                    <div>{item.count} Views</div>
                  </div>
                </div>
                <Link
                  to={`/product-view/${item.id}`}
                  state={{
                    product: {
                      ...item,
                      offerPrice: item.price,
                      oldPrice: parseInt(item.price) + 2000,
                      offer: '10%',
                      gallery: [item.image],
                      description: item.text,
                      subDescription: item.text,
                      subContent: item.text
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
