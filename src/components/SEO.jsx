import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  isNoIndexPath,
  toAbsoluteUrl,
} from '../config/site';

const SEO = ({ title, description, type, image, jsonLd, noindex, path }) => {
  const location = useLocation();
  const pathname = path || location.pathname;
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const fullTitle = !title
    ? DEFAULT_TITLE
    : title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
  const ogImage = image ? toAbsoluteUrl(image) : `${SITE_URL}/pwa-512.png`;
  const hideFromIndex = noindex ?? isNoIndexPath(pathname);

  const schemas = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      <meta
        name="robots"
        content={hideFromIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}
      />
      <meta name="theme-color" content="#0088cc" />

      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
