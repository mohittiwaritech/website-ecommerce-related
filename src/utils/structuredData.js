import { SITE_EMAIL, SITE_NAME, SITE_PHONE, SITE_URL, SITE_ADDRESS, DEFAULT_KEYWORDS, toAbsoluteUrl } from '../config/site';

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  logo: toAbsoluteUrl('/favicon.svg'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C-56/22 Sector 62',
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201309',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.youtube.com/@billingzone',
    'https://www.instagram.com/billingzone/',
    'https://www.facebook.com/billingzone.in/',
  ],
});

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  url: SITE_URL,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  image: toAbsoluteUrl('/favicon.svg'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_ADDRESS,
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201309',
    addressCountry: 'IN',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '19:00',
  },
  priceRange: '₹₹',
  areaServed: ['Noida', 'Delhi NCR', 'Uttar Pradesh', 'India'],
  knowsAbout: DEFAULT_KEYWORDS,
});

export const productSchema = (product, canonicalPath) => {
  if (!product) return null;

  const availability = product.inStock === false
    ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/InStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku || String(product.id),
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_NAME,
    },
    image: product.mainImage ? [toAbsoluteUrl(product.mainImage)] : undefined,
    description: Array.isArray(product.shortDesc)
      ? product.shortDesc.join('. ')
      : product.longDescription || product.title,
    category: product.category,
    keywords: [product.brand, product.category, product.sku, product.title].filter(Boolean).join(', '),
    url: toAbsoluteUrl(canonicalPath),
    offers: {
      '@type': 'Offer',
      url: toAbsoluteUrl(canonicalPath),
      priceCurrency: 'INR',
      price: String(product.price ?? ''),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };
};

export const breadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: toAbsoluteUrl(crumb.path),
  })),
});
