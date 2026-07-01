import React from 'react';

const Features = () => {
  const featureList = [
    {
      id: 1,
      title: 'Experience',
      desc: '2+ Years of experience in POS Industry',
      // Clock Icon
      icon: (
        <svg className="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Customers',
      desc: 'Over 500 + Happy Customers all over India',
      // Customers Icon
      icon: (
        <svg className="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Trust',
      desc: 'Trusted brand for Quality Products with CE, FCC, ROHS, BIS certification',
      // Trust/Badge Icon
      icon: (
        <svg className="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#EAEAEA] py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {featureList.map((item) => (
          <div key={item.id} className="bg-white p-12 flex flex-col items-center text-center shadow-sm">
            <div className="flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{item.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed max-w-[250px]">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;