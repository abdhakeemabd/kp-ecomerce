import React, { useState } from 'react';
import { BiLike, BiSolidLike, BiCart, BiSolidCart } from 'react-icons/bi';
import { PiShareFat } from 'react-icons/pi';
import { Link } from 'react-router-dom';

import Img1 from '../assets/images/img/1.webp';
import Img2 from '../assets/images/img/2.webp';
import Img3 from '../assets/images/img/3.webp';
import Img4 from '../assets/images/img/4.webp';
import Img5 from '../assets/images/img/5.webp';
import Img6 from '../assets/images/img/6.webp';

function Products() {
  const [likes, setLikes] = useState({});
  const [carts, setCarts] = useState({});
  const [activeTab, setActiveTab] = useState('wood');

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCart = (id) => {
    setCarts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
    {
      id: 'wood',
      label: 'Wood',
      products: [
        { id: 1, title: 'Wood', content: 'Lorem content', price: '10000', count: 123, image: Img1 },
        { id: 2, title: 'Metal', content: 'Lorem content', price: '10000', count: 143, image: Img2 },
        { id: 3, title: 'Glass', content: 'Lorem content', price: '10000', count: 23, image: Img3 },
      ],
    },
    {
      id: 'table',
      label: 'Table',
      products: [
        { id: 4, title: 'Glass', content: 'Lorem content', price: '10000', count: 53, image: Img4 },
        { id: 5, title: 'Glass', content: 'Lorem content', price: '10000', count: 63, image: Img5 },
        { id: 6, title: 'Glass', content: 'Lorem content', price: '10000', count: 83, image: Img6 },
      ],
    },
    {
      id: 'shelf',
      label: 'Shelf',
      products: [
        { id: 7, title: 'Glass', content: 'Lorem content', price: '10000', count: 53, image: Img4 },
        { id: 8, title: 'Glass', content: 'Lorem content', price: '10000', count: 63, image: Img5 },
        { id: 9, title: 'Glass', content: 'Lorem content', price: '10000', count: 83, image: Img6 },
      ],
    },
    {
      id: 'cupboard',
      label: 'Cupboard',
      products: [
        { id: 10, title: 'Glass', content: 'Lorem content', price: '10000', count: 53, image: Img4 },
        { id: 11, title: 'Glass', content: 'Lorem content', price: '10000', count: 63, image: Img5 },
        { id: 12, title: 'Glass', content: 'Lorem content', price: '10000', count: 83, image: Img6 },
      ],
    },
  ];

  return (
    <section className="product_main_sec py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Tab Header */}
          <div className="flex mb-6 overflow-x-auto flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'text-white bg-orange-500 rounded-sm'
                    : 'text-gray-600 hover:text-orange-600'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <div key={tab.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tab.products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-md shadow hover:shadow-lg transition relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-sm mb-3"
                    />
                    <div className="font-semibold mb-1">{product.title}</div>
                    <p className="text-gray-600 text-sm mb-1">{product.content}</p>
                    <div className="text-md font-bold text-gray-900">₹ {product.price}</div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-3 text-lg text-gray-700">
                        <button onClick={() => toggleLike(product.id)} className="hover:text-blue-500">
                          {likes[product.id] ? <BiSolidLike /> : <BiLike />}
                        </button>
                        <button onClick={() => toggleCart(product.id)} className="hover:text-blue-500">
                          {carts[product.id] ? <BiSolidCart /> : <BiCart />}
                        </button>
                        <button
                          onClick={() =>
                            navigator.share
                              ? navigator.share({
                                  title: product.title,
                                  text: product.content,
                                  url: window.location.href,
                                })
                              : alert('Sharing is not supported on this browser.')
                          }
                          className="hover:text-blue-500"
                        >
                          <PiShareFat />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">{product.count} Views</div>
                    </div>
                    <Link to="/product-view" className="absolute inset-0 z-10"></Link>

                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}

export default Products;
