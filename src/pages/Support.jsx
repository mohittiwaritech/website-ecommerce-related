import React, { useState, useEffect } from 'react';
import { getDrivers } from '../services/dbService';

const Support = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (error) {
        console.error("Error loading drivers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  return (
    <div className="w-full bg-white font-sans antialiased text-slate-900">
      <div className="py-8 text-center border-b border-gray-100">
        <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-slate-800">Drivers</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
          {loading ? (
            // Skeleton Loader
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center text-center animate-pulse">
                <div className="h-52 w-full bg-gray-50 border border-gray-100 rounded mb-6 flex items-center justify-center">
                  <div className="w-28 h-28 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 w-full flex flex-col items-center">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  <div className="h-8 w-2/3 bg-gray-200 rounded mt-4"></div>
                </div>
              </div>
            ))
          ) : (
            drivers.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center">
                <div className="h-52 w-full flex items-center justify-center mb-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="max-h-full object-contain" 
                    onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=Printer+Driver"; }}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[14px] font-bold text-slate-900 leading-tight">Drivers For {item.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Download {item.desc}</p>
                  <div className="pt-4 flex flex-col items-center gap-2">
                    {item.links.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#0073B7] text-white text-[10px] font-bold py-2 px-6 rounded-md uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 no-underline"
                      >
                        {link.label} <span className="text-[12px]">›</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;