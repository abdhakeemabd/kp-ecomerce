import React, { useState } from 'react';
import { BiLike, BiSolidLike, BiCart, BiSolidCart } from 'react-icons/bi';
import { PiShareFat } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import King1 from '../assets/images/king/1.jpeg';
import Img1 from '../assets/images/img/1.webp';
import Img2 from '../assets/images/img/2.webp';
import Img3 from '../assets/images/img/3.webp';
import Img4 from '../assets/images/product/table-4.webp';
import Img5 from '../assets/images/product/table-2.webp';
import Img6 from '../assets/images/product/table-3.webp';
import Shelf1 from '../assets/images/product/shelf-1.webp';
import Shelf2 from '../assets/images/product/shelf-2.webp';
import Shelf3 from '../assets/images/product/shelf-3.webp';
import Cupborad1 from '../assets/images/product/cupborad-4.webp';
import Cupborad2 from '../assets/images/product/cupborad-2.webp';
import Cupborad3 from '../assets/images/product/cupborad-3.webp';
import Fan1 from '../assets/images/product/fan-1.avif';
import Fan2 from '../assets/images/product/fan-2.webp';
import Fan3 from '../assets/images/product/fan-3.avif';
import cooler1 from '../assets/images/product/cooler-1.webp';
import cooler2 from '../assets/images/product/cooler-3.webp';
import cooler3 from '../assets/images/product/cooler-2.avif';
import cooler4 from '../assets/images/product/cooler-4.webp';
import Mattress1 from '../assets/images/product/mattress-1.webp';
import Mattress2 from '../assets/images/product/mattress-2.webp';
import Mattress3 from '../assets/images/product/mattress-3.webp';
import Mixies1 from '../assets/images/product/mixie-1.avif';
import Mixies2 from '../assets/images/product/mixie-2.avif';
import Mixies3 from '../assets/images/product/mixie-3.avif';
import Mixies4 from '../assets/images/product/mixie-4.avif';
import Speaker1 from '../assets/images/product/speaker-1.jpg';
import Speaker2 from '../assets/images/product/speaker-2.webp';
import Speaker3 from '../assets/images/product/speaker-3.webp';
import Tv1 from '../assets/images/product/tv-1.avif';
import Tv2 from '../assets/images/product/tv-2.avif';
import Tv3 from '../assets/images/product/tv-3.avif';




function Products() {
  const [likes, setLikes] = useState({});
  const [carts, setCarts] = useState({});
  const [activeTab, setActiveTab] = useState('Tablet');

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCart = (id) => {
    setCarts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
     {
      id: 'Tablet',
      label: 'Tablet',
      products: [
        { id: 1, title: 'COBRA ROMANCE', content: 'Natural Power for Lasting Romantic Love', price: '1299', count: 123, image: King1 },
      ],
    },
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
        { id: 4, title: 'LOONART Solid Sheesham', content: 'Lorem content', price: '10000', count: 53, image: Img4 },
        { id: 5, title: 'DITHA Furniture Solid Sheesham', content: 'Lorem content', price: '10000', count: 63, image: Img5 },
        { id: 6, title: 'Decor Solid Wood 4 Seater', content: 'Lorem content', price: '10000', count: 83, image: Img6 },
      ],
    },
    {
      id: 'shelf',
      label: 'Shelf',
      products: [
        { id: 7, title: 'Home Easy BS-1', content: 'Lorem content', price: '10000', count: 53, image: Shelf1 },
        { id: 8, title: 'HOMEEASY Engineered Wood', content: 'Lorem content', price: '10000', count: 63, image: Shelf2 },
        { id: 9, title: 'TANWAR HANDICRAFT Solid', content: 'Lorem content', price: '10000', count: 83, image: Shelf3 },
      ],
    },
    {
      id: 'cupboard',
      label: 'Cupboard',
      products: [
        { id: 10, title: 'Outkraft Wardrobe', content: 'Lorem content', price: '10000', count: 53, image: Cupborad1 },
        { id: 11, title: 'Ganpati Arts Sheesham', content: 'Lorem content', price: '10000', count: 63, image: Cupborad2 },
        { id: 12, title: 'CASPIAN Wooden Almirah', content: 'Lorem content', price: '10000', count: 83, image: Cupborad3 },
      ],
    },
    {
      id: 'Fan',
      label: 'Fans',
      products: [
        { id: 13, title: 'Sleepwell', content: 'Lorem content', price: '4500', count: 53, image: Fan1 },
        { id: 14, title: 'Wakefit', content: 'Lorem content', price: '6000', count: 63, image: Fan2 },
        { id: 15, title: 'Duroflex', content: 'Lorem content', price: '4500', count: 83, image: Fan3 },
      ],
    },
    {
      id: 'mattress',
      label: 'Mattress',
      products: [
        { id: 16, title: 'Crompton Greaves (Crompton)', content: 'Lorem content', price: '9000', count: 53, image: Mattress1 },
        { id: 17, title: 'Havells', content: 'Lorem content', price: '10000', count: 63, image: Mattress2 },
        { id: 18, title: 'Usha', content: 'Lorem content', price: '13000', count: 83, image: Mattress3 },
      ],
    },
    {
      id: 'mixe',
      label: 'Mixes',
      products: [
        { id: 19, title: 'Philips', content: 'Lorem content', price: '5500', count: 53, image: Mixies1 },
        { id: 20, title: 'Preethi', content: 'Lorem content', price: '3000', count: 63, image: Mixies2 },
        { id: 21, title: 'Bajaj', content: 'Lorem content', price: '5500', count: 83, image: Mixies3 },
        { id: 22, title: 'Bajaj', content: 'Lorem content', price: '5500', count: 83, image: Mixies4 },
      ],
    },
    {
      id: 'cooler',
      label: 'Coolers',
      products: [
        { id: 23, title: 'Symphony', content: 'Lorem content', price: '10500', count: 53, image: cooler1 },
        { id: 24, title: 'Crompton', content: 'Lorem content', price: '13000', count: 63, image: cooler2 },
        { id: 25, title: 'Bajaj', content: 'Lorem content', price: '15000', count: 83, image: cooler3 },
        { id: 26, title: 'Voltas', content: 'Lorem content', price: '18000', count: 83, image: cooler4 },
      ],
    },
    {
      id: 'speaker',
      label: 'Speakers',
      products: [
        { id: 27, title: 'JBL', content: 'Lorem content', price: '1300', count: 53, image: Speaker1 },
        { id: 28, title: 'ZEBRONICS', content: 'Lorem content', price: '3000', count: 63, image: Speaker2 },
        { id: 29, title: 'Marshall Kilburn', content: 'Lorem content', price: '5000', count: 83, image: Speaker3 },
      ],
    },
    {
      id: 'tv',
      label: 'TV',
      products: [
        { id: 30, title: 'Parasonic', content: 'Lorem content', price: '10500', count: 53, image: Tv1 },
        { id: 31, title: 'LG', content: 'Lorem content', price: '13000', count: 63, image: Tv2 },
        { id: 32, title: 'Samsung', content: 'Lorem content', price: '15000', count: 83, image: Tv3 },
      ],
    },
  ];

  return (
    <section className="product_main_sec py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex mb-6 overflow-x-auto flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id ? 'text-white bg-orange-500 rounded-sm' : 'text-gray-600 hover:text-orange-600'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          {tabs.map((tab) =>
            activeTab === tab.id ? (
              <div key={tab.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {tab.products.map((product) => (
                  <div key={product.id} className="bg-white p-4 rounded-md shadow hover:shadow-lg transition relative">
                    <img src={product.image} alt={product.title} className="w-full h-48 object-contain rounded-sm mb-3"/>
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
                            navigator.share ? navigator.share({ title: product.title, text: product.content, url: window.location.href,}) : alert('Sharing is not supported on this browser.')} className="hover:text-blue-500">
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
