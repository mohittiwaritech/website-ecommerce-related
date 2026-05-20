import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';

const Home = () => {
  return (
    <>
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <Features />
      
    </>
  );
};

export default Home;