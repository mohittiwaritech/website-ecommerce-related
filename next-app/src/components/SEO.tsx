"use client";
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, image }) => {
  const siteTitle = 'BillingZone';
  const fullTitle = title ? `${title} - ${siteTitle}` : `POS HARDWARE | ${siteTitle}`;
  const defaultDescription = 'BillingZone provides high-quality POS hardware, thermal receipt printers, barcode label printers, and billing software for your business needs.';
  const pageDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={pageDescription} />
      {/* End standard metadata tags */}

      {/* Open Graph metadata tags */}
      <meta property='og:type' content={type || 'website'} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={pageDescription} />
      {image && <meta property='og:image' content={image} />}
      {/* End Open Graph metadata tags */}

      {/* Twitter metadata tags */}
      <meta name='twitter:creator' content={name || 'BillingZone'} />
      <meta name='twitter:card' content={type === 'product' ? 'summary_large_image' : 'summary'} />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={pageDescription} />
      {image && <meta name='twitter:image' content={image} />}
      {/* End Twitter metadata tags */}
    </Helmet>
  );
};

export default SEO;
