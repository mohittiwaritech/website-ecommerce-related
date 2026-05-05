import React from 'react';
import HeroSlider from '../components/HeroSlider';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import Features from '../components/Features';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <>
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <Features />
      <WhyChooseUs />
    </>
  );
};

export default Home;