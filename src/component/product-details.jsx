import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import { FaShoppingCart, FaBolt, FaTruck, FaUndo, FaShieldAlt, FaBoxOpen } from 'react-icons/fa';
import { MdOutlineLocalOffer, MdGppGood, MdOutlineSupportAgent } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import "@fancyapps/ui/dist/fancybox/fancybox.css";

function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, getProductById } = useProducts();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const passedProduct = location.state?.product;
    const globalProduct = getProductById(id);

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
  }, [id, location.state, products, getProductById]);

  useEffect(() => {
    NativeFancybox.bind("[data-fancybox]", {
      Thumbs: { autoStart: false },
      Toolbar: true,
    });

    return () => {
      NativeFancybox.destroy();
    };
  }, []);

  const handleAddToCart = async () => {
    const result = await addToCart({
      id: product.id,
      title: product.title,
      content: product.content,
      price: product.offerPrice,
      offerPrice: product.offerPrice,
      image: product.gallery?.[0],
      gallery: product.gallery,
    });

    if (result.success) {
      // Navigate to cart page
      navigate('/cart');
    }
  };

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

                <div className="mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-start text-gray-900">
                      <span className="text-3xl font-medium">₹</span>
                      <span className="text-3xl font-semibold leading-none">{product.offerPrice}</span>
                    </div>
                    {product.offer && (
                      <span className="text-2xl font-semibold text-green-600 font-light">-{product.offer.replace(/[^0-9]/g, '')}%</span>
                    )}
                  </div>
                  {product.oldPrice && (
                    <div className="text-m text-gray-500 mt-2">
                       M.R.P.: <span className="line-through text-base font-semibold">₹{product.oldPrice}</span>
                    </div>
                  )}
                </div>

                {/* Shipping & Return Badges */}
                <div className="flex flex-wrap gap-3 mt-4 border-y border-gray-100 py-4">
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaTruck size={14} />
                    <span>{product.freeShipping ? "Free Delivery" : "Fast Delivery"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaUndo size={14} />
                    <span>{product.isReturnable ? "7 Day Returns" : "No Returns"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium">
                    <FaBoxOpen size={14} />
                    <span>{product.deliveryPolicy || "Kerala Delivery"}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[#323232] font-bold text-lg mb-2">Description</h4>
                  <div className="text-sm text-gray-700 mb-3">{product.description}</div>
                  <div className="text-sm text-gray-700 mb-2">{product.subDescription}</div>
                  <div className="text-sm text-gray-700 mb-2">{product.subContent}</div>
                </div>

                <div className="text-sm text-gray-500">{product.count} Views</div>

                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors duration-300 cursor-pointer"
                  >
                    <FaShoppingCart /> Add To Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-md cursor-pointer"
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
                {/* Product Highlights Section */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Product Highlights</h3>
                  <div className="p-1 bg-gray-100 rounded text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {product.highlights?.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                         {idx % 4 === 0 && <FaTruck size={18} />}
                         {idx % 4 === 1 && <FaUndo size={18} />}
                         {idx % 4 === 2 && <FaShieldAlt size={18} />}
                         {idx % 4 === 3 && <MdGppGood size={18} />}
                      </div>
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </div>
                  )) || (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <FaTruck size={18} />
                        </div>
                        <span className="text-gray-700 font-medium">Free Shipping</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <FaUndo size={18} />
                        </div>
                        <span className="text-gray-700 font-medium">Easy Returns</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                   <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                      <MdOutlineLocalOffer className="text-green-600" size={18} />
                      <span className="font-semibold">Best Price Guaranteed</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MdOutlineSupportAgent className="text-blue-600" size={18} />
                      <span className="font-semibold">24/7 Customer Support</span>
                   </div>
                </div>
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
