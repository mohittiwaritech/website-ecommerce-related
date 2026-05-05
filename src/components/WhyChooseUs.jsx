import React from 'react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      title: 'Priority Shipping',
      description: 'We want you to enjoy your new equipment as soon as possible, so we offer free ground shipping to make purchasing easier. Door step Delivery with 3-7 business days.',
      // Shipping Truck Icon
      icon: (
        <svg className="w-12 h-12 mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3m6 0H9" />
          <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Dedicated Support',
      description: 'Dedicated support team to help you out and respond as quickly as possible. Online support ticketing system to resolve queries or any required for setup.',
      // Support/Headset Icon
      icon: (
        <svg className="w-12 h-12 mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Warranty services',
      description: 'We provide free repairing or replacement of the device for any problem within the warranty period.',
      // Warranty/Settings Icon
      icon: (
        <svg className="w-12 h-12 mb-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full bg-[#EAEAEA] py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-center text-xl md:text-2xl font-bold text-gray-900 mb-12 tracking-wide uppercase">
          Why Choose Us ?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center px-6">
              <div className="bg-transparent p-2">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed max-w-xs font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;