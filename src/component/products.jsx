import React, { useState } from 'react';
import { BiLike, BiSolidLike, BiCart, BiSolidCart } from 'react-icons/bi';
import { PiShareFat } from 'react-icons/pi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

function Products() {
  const [likes, setLikes] = useState({});
  const [carts, setCarts] = useState({});
  const [activeTab, setActiveTab] = useState('All');
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { addToCart } = useCart();
  const { products } = useProducts();

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCart = async (product) => {
    const isInCart = carts[product.id];
    
    if (!isInCart) {
      // Add to cart
      const result = await addToCart({
        id: product.id,
        title: product.title,
        content: product.content,
        price: product.price || product.offerPrice,
        offerPrice: product.offerPrice || product.price,
        image: product.image || (product.gallery && product.gallery[0]),
        gallery: product.gallery || [product.image],
      });
      
      if (result.success) {
        setCarts((prev) => ({ ...prev, [product.id]: true }));
      }
    } else {
      // Visual feedback only - user can remove from cart page
      setCarts((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // Create tabs from categories
  const tabs = [
    { id: 'All', label: 'All Products', products: products },
    ...Object.keys(groupedProducts).map(category => ({
      id: category,
      label: category,
      products: groupedProducts[category]
    }))
  ];

  // Get active products
  const activeProducts = activeTab === 'All' 
    ? products 
    : groupedProducts[activeTab] || [];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {activeProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-md shadow hover:shadow-lg transition relative border border-[#ebebec] h-full flex flex-col">
                <div className="w-full aspect-square flex items-center justify-center bg-[#f2f2f200] rounded-sm mb-3 p-4 shrink-0 border border-[#ebebec] overflow-hidden">
                  <img src={product.image || (product.gallery && product.gallery[0])} alt={product.title} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="font-semibold mb-1">{product.title}</div>
                <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.content || product.description}</p>
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    {product.offer && (
                      <span className="text-2xl text-[#CC0C39] font-light">-{product.offer.replace(/[^0-9]/g, '')}%</span>
                    )}
                    <div className="flex items-start text-gray-900">
                      <span className="text-sm mt-1 font-medium">₹</span>
                      <span className="text-3xl font-medium leading-none">{product.offerPrice || product.price}</span>
                    </div>
                  </div>
                  {product.oldPrice && (
                    <div className="text-xs text-gray-500 mt-1">
                      M.R.P.: <span className="line-through">₹{product.oldPrice}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-3 text-lg text-gray-700">
                    <button onClick={() => toggleLike(product.id)} className="hover:text-red-500 transition-colors">
                      {likes[product.id] ? <BiSolidLike className="text-red-500" /> : <BiLike />}
                    </button>
                    <button onClick={() => toggleCart(product)} className="hover:text-orange-500 transition-colors">
                      {carts[product.id] ? <BiSolidCart /> : <BiCart />}
                    </button>
                    <button
                      onClick={() =>
                        navigator.share ? navigator.share({ title: product.title, text: product.content, url: window.location.href, }) : alert('Sharing is not supported on this browser.')} className="hover:text-blue-500">
                      <PiShareFat />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">{product.count || product.stock || 0} Views</div>
                </div>
                <Link
                  to={`/product-view/${product.id}`}
                  state={{
                    product: {
                      ...product,
                      offerPrice: product.offerPrice || product.price,
                      oldPrice: product.oldPrice || (parseInt(product.offerPrice || product.price) + 500),
                      offer: product.offer || '10%',
                      gallery: product.gallery || [product.image],
                      description: product.description || product.content,
                      subDescription: product.subDescription || product.content,
                      subContent: product.subContent || product.content
                    }
                  }}
                  className="absolute inset-0 z-10"
                ></Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
