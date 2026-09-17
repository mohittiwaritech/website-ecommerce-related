import {
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SITE_URL,
  SITE_ADDRESS,
  DEFAULT_KEYWORDS,
  toAbsoluteUrl,
} from '../config/site';
import { getProductUrl } from './slugify';

const postalAddress = () => ({
  '@type': 'PostalAddress',
  streetAddress: 'C-56/22 Sector 62',
  addressLocality: 'Noida',
  addressRegion: 'Uttar Pradesh',
  postalCode: '201309',
  addressCountry: 'IN',
});

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  logo: toAbsoluteUrl('/favicon.svg'),
  image: toAbsoluteUrl('/pwa-512.png'),
  address: postalAddress(),
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: SITE_PHONE,
      contactType: 'sales',
      email: SITE_EMAIL,
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  ],
  sameAs: [
    'https://www.youtube.com/@billingzone',
    'https://www.instagram.com/billingzone/',
    'https://www.facebook.com/billingzone.in/',
  ],
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
});

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ComputerStore',
  '@id': `${SITE_URL}/#store`,
  name: SITE_NAME,
  url: SITE_URL,
  email: SITE_EMAIL,
  telephone: SITE_PHONE,
  image: toAbsoluteUrl('/pwa-512.png'),
  logo: toAbsoluteUrl('/favicon.svg'),
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_ADDRESS,
    addressLocality: 'Noida',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201309',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.6271,
    longitude: 77.3726,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:00',
    closes: '19:00',
  },
  priceRange: '₹₹',
  areaServed: [
    { '@type': 'City', name: 'Noida' },
    { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    { '@type': 'Country', name: 'India' },
  ],
  knowsAbout: DEFAULT_KEYWORDS,
  parentOrganization: { '@id': `${SITE_URL}/#organization` },
});

export const webPageSchema = ({ name, description, path }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name,
  description,
  url: toAbsoluteUrl(path),
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#store` },
  inLanguage: 'en-IN',
});

export const itemListSchema = (products, listName = 'Products') => {
  if (!products?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 24).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.title,
      url: toAbsoluteUrl(getProductUrl(product)),
    })),
  };
};

export const productSchema = (product, canonicalPath) => {
  if (!product) return null;

  const availability =
    product.inStock === false
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock';

  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.sku || String(product.id),
    mpn: product.sku || String(product.id),
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_NAME,
    },
    image: product.mainImage ? [toAbsoluteUrl(product.mainImage)] : undefined,
    description: Array.isArray(product.shortDesc)
      ? product.shortDesc.join('. ')
      : product.longDescription || product.title,
    category: product.category,
    url: toAbsoluteUrl(canonicalPath),
    offers: {
      '@type': 'Offer',
      url: toAbsoluteUrl(canonicalPath),
      priceCurrency: 'INR',
      price: String(product.price ?? ''),
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: priceValidUntil.toISOString().slice(0, 10),
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnLink: `${SITE_URL}/refund`,
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

export const blogListSchema = (posts) => {
  if (!posts?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'BillingZone POS guides',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: toAbsoluteUrl(`/blog/${post.slug}`),
      name: post.title,
    })),
  };
};

export const articleSchema = (post) => {
  if (!post) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: toAbsoluteUrl('/favicon.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': toAbsoluteUrl(`/blog/${post.slug}`),
    },
    image: toAbsoluteUrl('/pwa-512.png'),
    keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : post.keywords,
    articleSection: post.category,
    inLanguage: 'en-IN',
  };
};

export const homePageSchemas = () => [
  websiteSchema(),
  organizationSchema(),
  localBusinessSchema(),
  webPageSchema({
    name: 'POS Machine, Thermal Printer & Billing Software',
    description:
      'BillingZone — ATPOS POS hardware and GST billing software dealer in Noida, India.',
    path: '/',
  }),
];
