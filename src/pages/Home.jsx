import React from 'react';
import SEO from '../components/SEO';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import { homePageSchemas } from '../utils/structuredData';
import { PAGE_KEYWORDS } from '../config/site';

const Home = () => {
  return (
    <>
      <SEO
        title="POS Machine, Thermal Printer & Billing Software in Noida | BillingZone"
        description="Buy POS billing machines, 58mm and 80mm thermal printers, barcode scanners, label printers, cash drawers and GST billing software for shops and restaurants. ATPOS dealer in Noida, shipping across India."
        keywords={PAGE_KEYWORDS.home}
        jsonLd={homePageSchemas()}
      />
      <HeroSlider />
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          POS machines, thermal printers and billing software
        </h1>
        <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
          BillingZone in Sector 62, Noida supplies ATPOS touch POS systems, Android billing machines, 58mm and 80mm thermal receipt printers, barcode label printers, 2D scanners, cash drawers, thermal paper rolls and GST billing software for restaurants, kirana, garment and retail shops. Driver downloads, GST invoice and pan-India delivery.
        </p>
      </section>
      <Categories />
      <FeaturedProducts />
      <Features />
      
    </>
  );
};

export default Home;