import React from 'react';
import SEO from '../components/SEO';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import { localBusinessSchema, organizationSchema } from '../utils/structuredData';

const Home = () => {
  return (
    <>
      <SEO
        title="POS Hardware & Billing Software | BillingZone"
        description="Thermal printers, barcode scanners, POS systems and billing software for retail and restaurants. Noida-based, pan-India shipping."
        jsonLd={[organizationSchema(), localBusinessSchema()]}
      />
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <Features />
      
    </>
  );
};

export default Home;