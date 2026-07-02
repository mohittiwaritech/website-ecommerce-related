"use client";
import React, { useState, useEffect } from 'react';
import { getDrivers } from '@/services/dbService';

// Local backup of drivers data to display if Firestore is blocked/fails
const fallbackDrivers = [
  { id: 1, name: "H58 Receipt Printer", image: "/assets/51JGHxjz28L._SL1200_.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
    { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2023/03/Atpos-H58-Driver-IE-Tool-for-CSP.zip" },
    { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
  ]},
  { id: 2, name: "MD80 Label | HL450 Receipt Printer", image: "/assets/HL450.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
    { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2025/03/Atpos-MD80-Drivers.zip" },
    { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
  ]},
  { id: 3, name: "M80 Receipt Printer", image: "/assets/m80.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
    { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2024/11/ATPOS-PrintDriver-AT345-Series.zip" },
    { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2024/11/Atpos-AT345-series-ReceiptPrinterFiles.zip" }
  ]},
  { id: 4, name: "HL300 / HL58 Receipt Printer", image: "/assets/Atpos-HL300s.jpg", desc: "Windows Driver, Linux Driver and SDK Kit", links: [
    { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2021/01/AtPOS-80-Series.zip" },
    { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
  ]},
  { id: 6, name: "HQ450L Label Printer", image: "/assets/450.webp", desc: "Windows Driver, Windows Diabel Software", links: [
    { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2024/12/Atpos-Label-Printer-E58-HQ450L-Driver-Setup.zip" },
    { label: "Software", url: "https://apps.microsoft.com/detail/9pmtsg6f98jc?hl=en-US&gl=US" }
  ]},
  { id: 7, name: "AT-301/302/402 Receipt Printer", image: "/assets/302.jpg", desc: "Windows Driver, MAC OS, Linux Driver and Tool Kit", links: [
    { label: "Windows Driver", url: "https://firebasestorage.googleapis.com/v0/b/volcora-products.appspot.com/o/V-WRP-A1%20%7C%20V-WLRP-A1%20Series%20Printer%2FDrivers%2FWindows%20Driver.zip?alt=media&token=f7726e70-9537-4d68-ae9e-039625acb2b8" },
    { label: "SDK, Tools & MAC OS", url: "https://www.atpos.in/wp-content/uploads/2024/11/Atpos-AT345-series-ReceiptPrinterFiles.zip" }
  ]},
  { id: 10, name: "E58 Label Printer", image: "/assets/e58bt.webp", desc: "Windows Driver & EM Label Software", links: [
    { label: "Windows Driver & Software", url: "https://www.atpos.in/wp-content/uploads/2024/12/Atpos-Label-Printer-E58-HQ450L-Driver-Setup.zip" },
    { label: "Android App", url: "https://drive.google.com/file/d/1iFn-nXUETwI_poZsiAQQ75w98ywE3fFZ/view?usp=sharing" }
  ]},
  { id: 11, name: "AT-602 Label Printer", image: "/assets/500sm-min.png", desc: "Windows Driver & EM Label Software", links: [
    { label: "Windows Driver & Software", url: "https://www.atpos.in/wp-content/uploads/2024/02/Atpos-AT-602-Windows-Driver-for-Label-and-Receipt-Printing-2023.zip" }
  ]}
];

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDrivers();
        if (data && data.length > 0) {
          setDrivers(data);
        } else {
          // Fallback to local copy if Firestore returned empty
          setDrivers(fallbackDrivers);
        }
      } catch (error) {
        console.error("Error loading drivers from database, using local fallback:", error);
        setDrivers(fallbackDrivers);
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

export default Drivers;
