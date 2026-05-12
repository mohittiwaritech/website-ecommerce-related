import React, { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      // PATH FIXED: 'src/assets' ki jagah direct '/assets'
      image: "/assets/h58001.png", 
      title: 'Fast, tough & easy to use receipt printer.',
      description: 'Small thermal printers packed with features to enable consistent, high-quality 2-inch wide receipt printing.',
      bgColor: 'bg-[#EAEAEA]'
    },
    {
      id: 2,
      // PATH FIXED: Extension agar .png hai toh code mein bhi wahi rakhein
      image: "/assets/500sm-min.png",
      title: 'High Speed Barcode Label Printer.',
      description: 'Reliable and durable label printing solutions for your business needs.',
      bgColor: 'bg-[#F5F5F5]'
    },
    {
      id: 3,
      // PATH FIXED: Case sensitivity ka dhyan rakhte hue exact naam likhein
      image: "/assets/atpos-at-506-Photoroom.png", 
      title: 'Wireless Mobile Bluetooth Printer',
      description: 'Print receipts on the go with our portable and long-lasting battery-powered printers.',
      bgColor: 'bg-[#F0F4F8]'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto-slide feature
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className={`relative w-full ${slides[currentSlide].bgColor} py-12 md:py-20 transition-all duration-500 overflow-hidden`}>
      
      {/* Left Arrow Button */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-md transition-all z-20"
      >
        <span className="text-xl">❮</span>
      </button>

      {/* Slide Content */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
        
        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 flex justify-center animate-fadeIn">
          <img 
            src={slides[currentSlide].image} 
            alt="Printer" 
            className="max-w-xs md:max-w-sm drop-shadow-2xl object-contain"
            // Agar image load nahi hui toh placeholder dikhega
            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=BillingZone+Printer"; }}
          />
        </div>

        {/* Right: Text and Action */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-8 max-w-md">
            {slides[currentSlide].description}
          </p>
          <button className="bg-[#0073B7] hover:bg-[#005a8f] text-white font-bold py-3 px-8 rounded text-sm uppercase tracking-wider transition-all shadow-lg">
            KNOW MORE ›
          </button>
        </div>

      </div>

      {/* Right Arrow Button */}
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-md transition-all z-20"
      >
        <span className="text-xl">❯</span>
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full border border-gray-600 transition-all ${
              currentSlide === index ? 'bg-black w-6' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;