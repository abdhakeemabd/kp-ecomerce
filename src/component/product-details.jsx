import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { products } from '../data/products';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import { FaShoppingCart, FaBolt } from 'react-icons/fa';
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(products[0]);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const passedProduct = location.state?.product;
    const globalProduct = products.find(p => p.id == id);

    if (passedProduct && globalProduct && passedProduct.title === globalProduct.title) {
      // If passed state matches global data (by title check to avoid ID collisions), 
      // use global data as it likely has richer content (e.g. full gallery).
      setProduct(globalProduct);
    } else if (passedProduct) {
      // If only passed state exists or titles mismatch (ID collision), use passed state.
      setProduct(passedProduct);
    } else if (globalProduct) {
      // Fallback for direct URL access.
      setProduct(globalProduct);
    }
    setActiveImage(0);
  }, [id, location.state]);

  useEffect(() => {
    NativeFancybox.bind("[data-fancybox]", {
      Thumbs: { autoStart: false },
      Toolbar: true,
    });

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  const handleBuyNow = () => {
    const message = `Hello, I want to order:\n\nProduct: ${product.title}\nPrice: ₹${product.offerPrice}\n\nPlease contact me.`;
    const whatsappUrl = `https://wa.me/919846007257?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <a
                href={product.gallery?.[activeImage]}
                data-fancybox="gallery"
                data-caption={`${product.title} - ₹${product.offerPrice}`}
                className="block w-full h-[500px] bg-[#f2f2f200] rounded-lg flex items-center justify-center overflow-hidden mb-4 border border-[#ebebec]"
              >
                <img
                  src={product.gallery?.[activeImage]}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                />
              </a>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
                <p className="text-gray-600">{product.content}</p>

                <div className="flex gap-3 items-center">
                  <span className="text-lg font-medium text-stone-800">₹{product.offerPrice}</span>
                  <span className="text-lg line-through text-[#898989]">₹{product.oldPrice}</span>
                  <span className="text-lg font-semibold text-[#388e4d]">{product.offer}</span>
                </div>

                <div>
                  <h4 className="text-[#323232] font-bold text-lg mb-2">Description</h4>
                  <div className="text-sm text-gray-700 mb-3">{product.description}</div>
                  <div className="text-sm text-gray-700 mb-2">{product.subDescription}</div>
                  <div className="text-sm text-gray-700 mb-2">{product.subContent}</div>
                </div>

                <div className="text-sm text-gray-500">{product.count} Views</div>

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
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT RELATED IMAGES */}
          <div className="md:col-span-5">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <div className="grid grid-cols-2 gap-4">
                {product.gallery?.map((img, index) => (
                  <div
                    key={index}
                    className="aspect-[1/1] cursor-pointer"
                    onClick={() => setActiveImage(index)}
                  >
                    <div
                      className={`h-full bg-gray-100 rounded-lg overflow-hidden transition-all duration-200
                        ${activeImage === index ? "border-2 border-[#ebebec]" : "border-2 border-transparent hover:border-[#ebebec]"}`}
                    >
                      <img
                        src={img}
                        alt="product"
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Hidden Switch Logic - kept logic if needed but hidden per original */}
              <div className="hidden">
                {/* Original switch buttons removed as they relied on array index which is no longer the primary state */}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
