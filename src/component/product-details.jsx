import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function ProductDetails() {
  const { id } = useParams();
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      const index = products.findIndex(p => p.id == id);
      if (index !== -1) {
        setActiveProduct(index);
      }
    }
  }, [id]);

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
