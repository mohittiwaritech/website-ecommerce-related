export const SITE_URL = 'https://www.billingzone.in';
export const SITE_NAME = 'BillingZone';
export const SITE_PHONE = '+91 9289024863';
export const SITE_EMAIL = 'sales@billingzone.in';
export const SITE_ADDRESS = 'C-56/22 Sector 62, Noida, Uttar Pradesh, 201309';
export const DEFAULT_DESCRIPTION =
  'POS hardware, thermal receipt printers, barcode scanners, label printers and billing software for shops and restaurants. Based in Noida, shipping across India.';
export const DEFAULT_TITLE = 'POS Hardware & Billing Software | BillingZone';

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
