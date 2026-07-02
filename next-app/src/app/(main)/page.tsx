import React from 'react';
import HeroSlider from '@/components/HeroSlider';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import Features from '@/components/Features';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home | BillingZone",
  description: "Welcome to BillingZone. Find the best POS hardware, thermal receipt printers, and barcode scanners."
};

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <Features />
    </>
  );
}
