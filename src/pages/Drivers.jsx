import React from 'react';

const DRIVERS_DATA = [
  { id: 1, name: "H58 Receipt Printer", image: "/h58bt.png", desc: "Windows Driver, Linux Driver and SDK Kit" },
  { id: 2, name: "MDB0 Label | HL450 Receipt Printer", image: "/hl450.png", desc: "Windows Driver, Linux Driver and SDK Kit" },
  { id: 3, name: "M10 Receipt Printer", image: "/m10.jpg", desc: "Windows Driver, Linux Driver and SDK Kit" },
  { id: 4, name: "HL300 / HL58 Receipt Printer", image: "/hl300.jpg", desc: "Windows Driver, Linux Driver and SDK Kit" },
  { id: 5, name: "AT-490B Label Receipt Printer", image: "/at490b.jpg", desc: "Windows Driver, Linux Driver and SDK Kit" },
  { id: 6, name: "HQ450L Label Printer", image: "/hq450l.jpg", desc: "Windows Driver, Windows Diabel Software" },
  { id: 7, name: "AT-301/302/402 Receipt Printer", image: "/at302.jpg", desc: "Windows Driver, MAC OS, Linux Driver and Tool Kit" },
  { id: 8, category: 'Receipt Printer', name: 'AT-502/507 Receipt Printer', image: '/at502.jpg', desc: "Windows Driver, MAC OS, Linux Driver and Tool Kit" },
  { id: 9, name: "AT-506/406 Receipt Printer", image: "/at506.jpg", desc: "Windows Driver, MAC OS, Linux Driver and Tool Kit" },
  { id: 10, name: "E58 Label Printer", image: "/e58.jpg", desc: "Windows Driver & EM Label Software" },
  { id: 11, name: "AT-602 Label Printer", image: "/at602.jpg", desc: "Windows Driver & EM Label Software" },
  { id: 12, name: "Atpos TT426B Label Printer", image: "/tt426b.jpg", desc: "Windows Driver & EM Label Software" },
];

const Drivers = () => {
  return (
    <div className="w-full bg-white font-sans text-slate-800">
      {/* Page Title */}
      <div className="py-10 text-center border-b border-gray-100">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-900">Drivers</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12">
          {DRIVERS_DATA.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center group">
              {/* Image Section */}
              <div className="h-56 w-full flex items-center justify-center mb-6 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Hardware"; }}
                />
              </div>

              {/* Info Section */}
              <div className="space-y-3">
                <h3 className="text-[15px] font-bold text-slate-900 leading-tight">Drivers For {item.name}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed max-w-[250px] mx-auto uppercase">
                  Download {item.desc}
                </p>
                
                {/* Download Buttons - Exactly like the image */}
                <div className="pt-4 flex flex-col items-center gap-2">
                  <button className="bg-[#0073B7] text-white text-[10px] font-bold py-2.5 px-8 rounded-md uppercase tracking-wider hover:bg-black transition-all">
                    Windows Driver ›
                  </button>
                  {item.name.includes("E58") || item.name.includes("602") ? (
                    <button className="bg-[#0073B7] text-white text-[10px] font-bold py-2.5 px-8 rounded-md uppercase tracking-wider hover:bg-black transition-all">
                      Android App ›
                    </button>
                  ) : (
                    <button className="bg-[#0073B7] text-white text-[10px] font-bold py-2.5 px-8 rounded-md uppercase tracking-wider hover:bg-black transition-all">
                      Tools & SDK Kit ›
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Drivers;