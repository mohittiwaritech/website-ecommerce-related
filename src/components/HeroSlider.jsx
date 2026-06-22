import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      image: "/assets/h58001.png",
      title: 'Fast, tough & easy to use receipt printer.',
      description:
        'Small thermal printers packed with features to enable consistent, high-quality 2-inch wide receipt printing.',
      bgColor: 'bg-[#EAEAEA]',
      link: '/product/10-atpos-h58bt-58mm-bluetooth-thermal-receipt-printer'
    },
    {
      id: 2,
      image: "/assets/500sm-min.png",
      title: 'High Speed Barcode Label Printer.',
      description:
        'Reliable and durable label printing solutions for your business needs.',
      bgColor: 'bg-[#F5F5F5]',
      link: '/product/4-atpos-at-602-80mm-3-inch-dual-mode-thermal-receipt-printer'
    },
    {
      id: 3,
      image: "/assets/barcode-removebg-preview.png",
      title: 'Wireless Mobile Bluetooth Printer',
      description:
        'Print receipts on the go with our portable and long-lasting battery-powered printers.',
      bgColor: 'bg-[#F5F5F5]',
      link: '/product/5-atpos-e58-bluetooth-thermal-barcode-label-sticker-printer'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div
      className={`relative w-full ${slides[currentSlide].bgColor} py-12 md:py-20 transition-all duration-500 overflow-hidden`}
    >

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-md transition-all z-20"
      >
        <span className="text-xl">❮</span>
      </button>

      {/* Slide Content */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">

        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center animate-fadeIn">
          <img
            src={slides[currentSlide].image}
            alt="Printer"
            className="max-w-xs md:max-w-sm drop-shadow-2xl object-contain"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=BillingZone+Printer";
            }}
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            {slides[currentSlide].title}
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-8 max-w-md">
            {slides[currentSlide].description}
          </p>

          {/* KNOW MORE BUTTON */}
          <button
            onClick={() =>
              navigate(slides[currentSlide].link)
            }
            className="bg-[#0073B7] hover:bg-[#005a8f] text-white font-bold py-3 px-8 rounded text-sm uppercase tracking-wider transition-all shadow-lg"
          >
            KNOW MORE ›
          </button>
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-md transition-all z-20"
      >
        <span className="text-xl">❯</span>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 rounded-full border border-gray-600 transition-all ${
              currentSlide === index
                ? 'bg-black w-6'
                : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;