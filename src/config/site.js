export const SITE_URL = 'https://www.billingzone.in';
export const SITE_NAME = 'BillingZone';
export const SITE_PHONE = '+91 9289024863';
export const SITE_EMAIL = 'sales@billingzone.in';
export const SITE_ADDRESS = 'C-56/22 Sector 62, Noida, Uttar Pradesh, 201309';
export const DEFAULT_DESCRIPTION =
  'Buy POS machines, 58mm/80mm thermal receipt printers, barcode scanners, label printers, cash drawers and GST billing software in Noida. ATPOS hardware, pan-India shipping.';
export const DEFAULT_TITLE =
  'POS Machine, Thermal Printer & Billing Software in Noida | BillingZone';

export const DEFAULT_KEYWORDS = [
  'POS machine',
  'POS billing machine',
  'billing machine',
  'billing machine price',
  'touch POS system',
  'Android POS',
  'restaurant POS',
  'retail POS',
  'kirana billing machine',
  'GST billing software',
  'restaurant billing software',
  'cafe billing software',
  'garment billing software',
  'retail billing software',
  'thermal printer',
  'thermal receipt printer',
  '58mm thermal printer',
  '80mm thermal printer',
  '3 inch receipt printer',
  'auto cutter printer',
  'Bluetooth thermal printer',
  'USB receipt printer',
  'mobile printer',
  'barcode printer',
  'barcode label printer',
  'sticker printer',
  'barcode scanner',
  '2D barcode scanner',
  'QR code scanner',
  'cash drawer',
  'cash box',
  'POS hardware',
  'thermal paper roll',
  'barcode label roll',
  'ATPOS printer',
  'ATPOS H58 driver',
  'printer driver download',
  'POS dealer Noida',
  'POS machine Delhi NCR',
  'BillingZone',
];

export const PAGE_KEYWORDS = {
  home: DEFAULT_KEYWORDS,
  products: [
    'buy POS machine online',
    'thermal printer price India',
    'barcode scanner price',
    'cash drawer for POS',
    'ATPOS POS system',
    'billing software download',
  ],
  drivers: [
    'ATPOS driver',
    'H58 printer driver',
    'HL450 driver',
    'E58 label printer driver',
    'AT-602 driver',
    'thermal printer Windows driver',
    'receipt printer Linux driver',
    'POS printer SDK',
  ],
  contact: [
    'POS dealer Noida',
    'POS shop Sector 62',
    'billing machine Noida',
    'thermal printer dealer Delhi NCR',
  ],
};

export const joinKeywords = (...lists) =>
  [...new Set(lists.flat().filter(Boolean))].join(', ');

export const productKeywords = (product) => {
  if (!product) return DEFAULT_KEYWORDS;
  const category = product.category || '';
  const title = product.title || '';
  const extras = [
    product.brand,
    category,
    product.sku,
    title,
    `${category} price`,
    `${product.brand || 'ATPOS'} ${category}`.trim(),
    'GST invoice',
    'Noida',
    'India',
  ];
  if (/58/.test(title) || /58/.test(category)) extras.push('58mm thermal printer');
  if (/80|3 inch|3-inch/i.test(title)) extras.push('80mm thermal printer', '3 inch receipt printer');
  if (/bluetooth/i.test(title)) extras.push('Bluetooth thermal printer');
  if (/scanner/i.test(title + category)) extras.push('barcode scanner', 'QR scanner');
  if (/software/i.test(title + category)) extras.push('GST billing software');
  if (/cash/i.test(title + category)) extras.push('cash drawer', 'cash box');
  if (/label/i.test(title + category)) extras.push('barcode label printer', 'sticker printer');
  return [...DEFAULT_KEYWORDS, ...extras];
};

export const NOINDEX_PATHS = [
  '/admin',
  '/cart',
  '/checkout',
  '/login',
  '/my-orders',
  '/order-complete',
];

export const isNoIndexPath = (pathname) =>
  NOINDEX_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export const toAbsoluteUrl = (path = '/') => {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
