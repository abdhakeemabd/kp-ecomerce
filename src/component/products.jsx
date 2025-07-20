import React, { useState } from 'react';
import img1 from '../assets/images/img/1.jpg';
import img2 from '../assets/images/img/2.jpg';
import img3 from '../assets/images/img/3.jpg';
import img4 from '../assets/images/img/4.jpg';
import img5 from '../assets/images/img/5.jpg';
import img6 from '../assets/images/img/6.jpg';

function Products() {
  const tabs = [
    {
      id: 'wood',
      label: 'Wood',
      products: [
        { id: 1, image: img1, content: 'Wood Product 1' },
        { id: 2, image: img2, content: 'Wood Product 2' },
        { id: 3, image: img3, content: 'Wood Product 3' },
      ],
    },
    {
      id: 'table',
      label: 'Table',
      products: [
        { id: 4, image: img4, content: 'Table Product 1' },
        { id: 5, image: img5, content: 'Table Product 2' },
      ],
    },
    {
      id: 'shelf',
      label: 'Shelf',
      products: [
        { id: 6, image: img6, content: 'Shelf Product 1' },
        { id: 7, image: img2, content: 'Shelf Product 2' },
      ],
    },
    {
      id: 'cupboard',
      label: 'Cupboard',
      products: [
        { id: 8, image: img1, content: 'Cupboard Product 1' },
        { id: 9, image: img1, content: 'Cupboard Product 2' },
      ],
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="product_main_sec">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-6xl mx-auto">
          {/* Tabs Header */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>
            {tabs.map((tab) =>
              activeTab === tab.id ? (
                <div key={tab.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {tab.products.map((product) => (
                    <div key={product.id} className="product-card text-gray-700 text-sm leading-relaxed p-3 rounded-md shadow hover:shadow-lg transition">
                      <img className="pro-img object-cover rounded-sm mb-3" src={product.image} alt={`Product ${product.id}`}/>
                      <div className="font-medium">{product.content}</div>
                    </div>
                  ))}
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;
