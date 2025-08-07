import React from 'react';
import { MdSearch, MdTouchApp, MdFlashOn, MdVerifiedUser } from "react-icons/md";

function HowWork() {
  const items = [
    {
      icon: <MdSearch className="text-6xl text-primary mx-auto mb-4" />,
      title: "Search What You Need",
      description: "Find services, products, or information tailored to your needs with our intelligent search system."
    },
    {
      icon: <MdTouchApp className="text-6xl text-primary mx-auto mb-4" />,
      title: "Choose Your Preference",
      description: "Browse through curated results and select the most suitable option effortlessly."
    },
    {
      icon: <MdFlashOn className="text-6xl text-primary mx-auto mb-4" />,
      title: "Get Instant Results",
      description: "Experience fast and reliable outcomes tailored to your preferences, delivered instantly."
    },
    {
      icon: <MdVerifiedUser className="text-6xl text-primary mx-auto mb-4" />,
      title: "Enjoy Reliable Service",
      description: "Our verified providers and secure platform ensure a safe and satisfying experience."
    }
  ];

  return (
    <section className="how_work_sec py-16 bg-gray-50 relative">
      <div className="container mx-auto px-4 relative">
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 z-0">
          <div className="flex justify-between items-center w-full px-10">
            {items.map((_, index) => (
              <React.Fragment key={index}>
                <div className="w-5 h-5 border-2 border-blue-500 rounded-full bg-white z-0" />
                {index < items.length - 1 && (
                  <div className="flex-1 border-t-2 border-dashed border-blue-500 relative">
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M10 6 L16 12 L10 18" stroke="#3B82F6" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-12 relative z-10">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {items.map((item, index) => (
            <div key={index} className="relative text-center p-6 bg-white rounded-xl shadow hover:shadow-lg transition duration-300 ease-in-out group">
              <div className="absolute top-4 left-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm transition transform group-hover:scale-110">
                {index + 1}
              </div>
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWork;
