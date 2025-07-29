import React, { useEffect, useState } from 'react';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import Img1 from '../assets/images/img/1.webp';
import Img2 from '../assets/images/img/2.webp';
import Img3 from '../assets/images/img/3.webp';
import Img4 from '../assets/images/img/4.webp';
import Img5 from '../assets/images/img/5.webp';
import Img6 from '../assets/images/img/6.webp';

function ProductDetails() {
  const [activeProduct, setActiveProduct] = useState(0);
  const products = [
    { id: 1, title: 'Wood', content: 'Premium quality wood material', oldPrice: '10,000', offer:"3%", offerPrice: "9,000", count: 123, image: Img1, description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", subDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type", subContent:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " },
    { id: 2, title: 'Metal', content: 'Durable metal construction', oldPrice: '11,000', offer:"3%", offerPrice: "9,000", count: 143, image: Img2, description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", subDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type", subContent:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " },
    { id: 3, title: 'Glass', content: 'Tempered glass surface', oldPrice: '12,000', offer:"3%", offerPrice: "9,000", count: 23, image: Img3, description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", subDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type", subContent:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " },
    { id: 4, title: 'Wood', content: 'Eco-friendly wood finish', oldPrice: '13,000', offer:"3%", offerPrice: "9,000", count: 123, image: Img4, description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", subDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type", subContent:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " },
    { id: 5, title: 'Metal', content: 'Stainless steel material', oldPrice: '14,000', offer:"3%", offerPrice: "9,000", count: 143, image: Img5, description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", subDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type", subContent:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " },
    { id: 6, title: 'Glass', content: 'Frosted glass texture', oldPrice: '15,000', offer:"3%", offerPrice: "9,000", count: 23, image: Img6, description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.", subDescription:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type", subContent:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum " },
  ];

  useEffect(() => {
    NativeFancybox.bind("[data-fancybox]", {
      Thumbs: {
        autoStart: false,
      },
      Toolbar: true,
    });

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  const handleThumbnailClick = (index) => {
    setActiveProduct(index);
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <a href={products[activeProduct].image} data-fancybox="gallery" data-caption={`${products[activeProduct].title} - ₹${products[activeProduct].price}`}>
                <img src={products[activeProduct].image} alt={products[activeProduct].title} className="w-full h-auto object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity duration-200"/>
              </a>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">{products[activeProduct].title}</h3>
                <p className="text-gray-600">{products[activeProduct].content}</p>
                <div className="flex gap-3 items-center">
                  <span className="text-lg font-medium text-stone-800">₹{products[activeProduct].offerPrice}</span>
                  <span className="text-lg line-through text-[#898989]">₹{products[activeProduct].oldPrice}</span>
                  <span className="text-lg font-semibold text-[#388e4d]">₹{products[activeProduct].offer}</span>
                </div>
                <div>
                  <h4 className="text-[#323232] font-bold text-lg mb-2">Description</h4>
                  <div className="text-sm text-gray-700 mb-3">{products[activeProduct].description}</div>
                  <div className="text-sm text-gray-700 mb-2">{products[activeProduct].subDescription}</div>
                  <div className="text-sm text-gray-700 mb-2">{products[activeProduct].subContent}</div>
                </div>
                <div className="text-sm text-gray-500">{products[activeProduct].count} Views</div>
                <div className="flex gap-4 mt-6">
                  <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors duration-300">
                    <FaShoppingCart /> Add To Cart
                 </button>
                  <button className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-md">
                    <FaBolt /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>          
          <div className="md:col-span-5">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <div className="grid grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <div key={product.id} className="aspect-[300/205] cursor-pointer"onClick={() => handleThumbnailClick(index)}>
                    <div className="h-full bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-300 transition-all duration-200">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;