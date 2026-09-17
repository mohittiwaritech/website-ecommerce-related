import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  isNoIndexPath,
  joinKeywords,
  toAbsoluteUrl,
} from '../config/site';
import { buildCanonical, OG_IMAGE, TWITTER_HANDLE, truncateDescription } from '../config/seo';

const SEO = ({
  title,
  description,
  type,
  image,
  imageAlt,
  jsonLd,
  noindex,
  path,
  keywords,
  price,
  priceCurrency = 'INR',
}) => {
  const location = useLocation();
  const pathname = path || location.pathname;
  const useQueryForCanonical = !path && pathname === '/products';
  const canonical = buildCanonical(
    pathname,
    useQueryForCanonical ? location.search : ''
  );
  const pageDescription = truncateDescription(description || DEFAULT_DESCRIPTION);
  const fullTitle = !title
    ? DEFAULT_TITLE
    : title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
  const ogImage = image ? toAbsoluteUrl(image) : OG_IMAGE.url;
  const ogImageAlt = imageAlt || (type === 'product' ? fullTitle : OG_IMAGE.alt);
  const hideFromIndex = noindex ?? isNoIndexPath(pathname);
  const keywordList = joinKeywords(DEFAULT_KEYWORDS, keywords || []);
  const isProduct = type === 'product';

  const schemas = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang="en-IN" />
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywordList} />
      <meta name="author" content={SITE_NAME} />
      <meta name="publisher" content={SITE_NAME} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en-in" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      <meta
        name="robots"
        content={
          hideFromIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <meta name="googlebot" content={hideFromIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="theme-color" content="#0088cc" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="Noida, Uttar Pradesh" />
      <meta name="geo.position" content="28.6271;77.3726" />
      <meta name="ICBM" content="28.6271, 77.3726" />

      <meta property="og:type" content={isProduct ? 'product' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content={String(OG_IMAGE.width)} />
      <meta property="og:image:height" content={String(OG_IMAGE.height)} />
      <meta property="og:image:alt" content={ogImageAlt} />

      {isProduct && price != null && price !== '' && (
        <>
          <meta property="product:price:amount" content={String(price)} />
          <meta property="product:price:currency" content={priceCurrency} />
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
