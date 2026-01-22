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

import Cobra1 from '../assets/images/king/1.jpeg';
import Cobra2 from '../assets/images/king/2.jpeg';
import Cobra3 from '../assets/images/king/3.jpeg';
import Cobra4 from '../assets/images/king/4.jpeg';

function ProductDetails() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const products = [
    {
      id: 1,
      title: 'COBRA ROMANCE',
      content: 'Strategy: Dark Luxury Aesthetics + Clinical Trust Triggers',
      oldPrice: '1699',
      offer: "23%",
      offerPrice: "1299",
      count: 23,
      gallery: [Cobra1, Cobra2, Cobra3, Cobra4],
      description: "Cobra Romance is a premium Ayurvedic formula for natural strength and lasting intimacy. It activates within 30 minutes and delivers results for up to 4 days. Made using advanced Thanthu Paka extraction for 2.5× potency. Clinically safe with no headaches, BP spikes, or addiction. 100% private shipping with government-approved quality.",
      subDescription: "Cobra Romance is a government-approved Ayurvedic formulation designed to restore natural strength, stamina, and romantic confidence without harmful chemicals or artificial stimulants. Crafted using the advanced Thanthu Paka extraction method, it delivers 2.5× higher herbal potency for faster absorption and longer-lasting results.",
      subContent: "Cobra Romance is a premium Ayurvedic vitality formula crafted to enhance stamina, confidence, and deep romantic connection naturally. Powered by advanced Thanthu Paka extraction, it delivers faster absorption and long-lasting results without harmful chemicals or side effects."
    },
    {
      id: 2,
      title: 'Metal',
      content: 'Durable metal construction',
      oldPrice: '11,000',
      offer: "3%",
      offerPrice: "9,000",
      count: 143,
      gallery: [Img2],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      id: 3,
      title: 'Glass',
      content: 'Tempered glass surface',
      oldPrice: '12,000',
      offer: "3%",
      offerPrice: "9,000",
      count: 23,
      gallery: [Img3],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      id: 4,
      title: 'Wood',
      content: 'Eco-friendly wood finish',
      oldPrice: '13,000',
      offer: "3%",
      offerPrice: "9,000",
      count: 123,
      gallery: [Img4],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      id: 5,
      title: 'Metal',
      content: 'Stainless steel material',
      oldPrice: '14,000',
      offer: "3%",
      offerPrice: "9,000",
      count: 143,
      gallery: [Img5],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      id: 6,
      title: 'Glass',
      content: 'Frosted glass texture',
      oldPrice: '15,000',
      offer: "3%",
      offerPrice: "9,000",
      count: 23,
      gallery: [Img6],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
    {
      id: 7,
      title: 'Wood',
      content: 'Premium quality wood material',
      oldPrice: '10,000',
      offer: "3%",
      offerPrice: "9,000",
      count: 123,
      gallery: [Img1],
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subDescription: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      subContent: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    },
  ];

  useEffect(() => {
    NativeFancybox.bind("[data-fancybox]", {
      Thumbs: { autoStart: false },
      Toolbar: true,
    });

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  const handleProductClick = (index) => {
    setActiveProduct(index);
    setActiveImage(0);
  };

  // ✅ BUY NOW HANDLER
  const handleBuyNow = () => {
    const product = products[activeProduct];
    const message = `Hello, I want to order:\n\nProduct: ${product.title}\nPrice: ₹${product.offerPrice}\n\nPlease contact me.`;
    const whatsappUrl = `https://wa.me/9198460 07257?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // ✅ OPTIONAL EMAIL HANDLER
  const handleEmail = () => {
    const product = products[activeProduct];
    const subject = `Order Request - ${product.title}`;
    const body = `Hello,\n\nI want to order the following product:\n\nProduct: ${product.title}\nPrice: ₹${product.offerPrice}\n\nPlease contact me.\n\nThanks`;
    window.location.href = `mailto:yourmail@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* LEFT MAIN PRODUCT */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <a
                href={products[activeProduct].gallery[activeImage]}
                data-fancybox="gallery"
                data-caption={`${products[activeProduct].title} - ₹${products[activeProduct].offerPrice}`}
              >
                <img
                  src={products[activeProduct].gallery[activeImage]}
                  alt={products[activeProduct].title}
                  className="w-full h-auto object-cover rounded-lg mb-4 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                />
              </a>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">{products[activeProduct].title}</h3>
                <p className="text-gray-600">{products[activeProduct].content}</p>

                <div className="flex gap-3 items-center">
                  <span className="text-lg font-medium text-stone-800">₹{products[activeProduct].offerPrice}</span>
                  <span className="text-lg line-through text-[#898989]">₹{products[activeProduct].oldPrice}</span>
                  <span className="text-lg font-semibold text-[#388e4d]">{products[activeProduct].offer}</span>
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

                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-md"
                  >
                    <FaBolt /> Buy Now
                  </button>

                  {/* OPTIONAL EMAIL BUTTON */}
                  {/* 
                  <button
                    onClick={handleEmail}
                    className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-md"
                  >
                    Email
                  </button> 
                  */}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT RELATED IMAGES */}
          <div className="md:col-span-5">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <div className="grid grid-cols-2 gap-4">
                {products[activeProduct].gallery.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-[300/205] cursor-pointer"
                    onClick={() => setActiveImage(index)}
                  >
                    <div
                      className={`h-full bg-gray-100 rounded-lg overflow-hidden transition-all duration-200
                        ${activeImage === index ? "ring-2 ring-indigo-500" : "hover:ring-2 hover:ring-indigo-300"}`}
                    >
                      <img
                        src={img}
                        alt="product"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden">
                {products.map((_, i) => (
                  <button key={i} onClick={() => handleProductClick(i)}>Switch</button>
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
