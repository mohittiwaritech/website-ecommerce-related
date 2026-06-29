import React from 'react';
import SEO from '../components/SEO';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';

const Home = () => {
  return (
    <>
      <SEO 
        title="Home" 
        description="Welcome to BillingZone. Find the best POS hardware, thermal receipt printers, and barcode scanners." 
      />
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <Features />
      
    </>
  );
};

export default Home;