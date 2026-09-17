import { DEFAULT_KEYWORDS, SITE_NAME, SITE_URL, joinKeywords } from './site.js';

/** Meta description safe length for Google snippets */
export const META_DESC_MAX = 160;
export const META_TITLE_MAX = 60;

export const truncateDescription = (text, max = META_DESC_MAX) => {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
};

export const buildCanonical = (pathname, search = '') => {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const base = `${SITE_URL}${path}`;
  if (!search) return base;

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const allowed = new URLSearchParams();
  const category = params.get('category');
  const type = params.get('type');
  if (category) allowed.set('category', category);
  if (type) allowed.set('type', type);
  const qs = allowed.toString();
  return qs ? `${base}?${qs}` : base;
};

export const OG_IMAGE = {
  url: `${SITE_URL}/pwa-512.png`,
  width: 512,
  height: 512,
  alt: `${SITE_NAME} — POS machines, thermal printers and billing software`,
};

export const TWITTER_HANDLE = '@billingzone';

/** Category / filter landing pages — titles tuned for search intent */
export const CATEGORY_SEO = {
  'Receipt Printer': {
    title: 'Thermal Receipt Printer — 58mm & 80mm | Buy Online India',
    description:
      'Shop 58mm and 80mm thermal receipt printers with auto cutter, USB and Bluetooth. ATPOS models for restaurants and retail. GST invoice, delivery across India.',
    keywords: ['thermal receipt printer', '58mm printer', '80mm printer', 'ATPOS receipt printer'],
  },
  'Label Printer': {
    title: 'Barcode Label Printer & Sticker Printer Price',
    description:
      'Buy barcode label printers and thermal sticker printers for retail, courier and warehouse. ATPOS E58, HQ450L and dual-mode models from BillingZone Noida.',
    keywords: ['barcode label printer', 'sticker printer', 'thermal label printer', 'E58 printer'],
  },
  'Mobile Printer': {
    title: 'Bluetooth Mobile Thermal Printer Portable',
    description:
      'Portable Bluetooth thermal printers for billing on the go. Pocket receipt printers for delivery, field sales and small shops. Ships across India.',
    keywords: ['mobile printer', 'Bluetooth thermal printer', 'portable receipt printer'],
  },
  'POS System': {
    title: 'Touch POS Machine & Billing System Price India',
    description:
      'Android and Windows touch POS systems with built-in printer options. Restaurant and retail billing machines from ATPOS. Dealer in Noida.',
    keywords: ['POS machine', 'touch POS', 'Android POS', 'restaurant billing machine'],
  },
  'Barcode Scanner': {
    title: 'Barcode Scanner & QR Scanner 2D Wired USB',
    description:
      'Desktop 2D barcode and QR code scanners for retail POS. USB wired scanners compatible with billing software. Buy from BillingZone.',
    keywords: ['barcode scanner', '2D scanner', 'QR code scanner', 'POS scanner'],
  },
  'Cash Box': {
    title: 'POS Cash Drawer & Cash Box for Billing Counter',
    description:
      'Heavy-duty cash drawers for POS counters. RJ11 trigger cash boxes for receipt printers and retail shops.',
    keywords: ['cash drawer', 'cash box', 'POS cash drawer'],
  },
  'Billing Software': {
    title: 'GST Billing Software for Restaurant, Retail & Cafe',
    description:
      'Restaurant, cafe, garment and retail GST billing software. License with support from BillingZone Noida.',
    keywords: ['GST billing software', 'restaurant software', 'retail billing software'],
  },
  'Label roll': {
    title: 'Thermal Barcode Label Roll & Sticker Paper',
    description:
      'Direct thermal barcode label rolls and sticker paper for label printers. Compatible sizes for ATPOS and common 50x30mm labels.',
    keywords: ['barcode label roll', 'thermal label paper', 'sticker roll'],
  },
};

export const FILTER_SEO = {
  hardware: {
    title: 'POS Hardware — Printers, Scanners, Cash Drawer',
    description:
      'All POS hardware: thermal printers, barcode scanners, cash drawers, POS terminals and accessories. ATPOS dealer, pan-India shipping.',
    keywords: ['POS hardware', 'billing hardware', 'shop billing machine'],
  },
};

export const getProductsPageSeo = (search) => {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search || '');
  const category = params.get('category');
  const type = params.get('type');

  if (category && CATEGORY_SEO[category]) {
    const c = CATEGORY_SEO[category];
    return {
      title: c.title,
      description: truncateDescription(c.description),
      keywords: joinKeywords(DEFAULT_KEYWORDS, c.keywords),
      path: '/products',
      listName: `${category} — ${SITE_NAME}`,
    };
  }

  if (type === 'hardware' && FILTER_SEO.hardware) {
    const h = FILTER_SEO.hardware;
    return {
      title: h.title,
      description: truncateDescription(h.description),
      keywords: joinKeywords(DEFAULT_KEYWORDS, h.keywords),
      path: '/products',
      listName: 'POS hardware',
    };
  }

  return {
    title: 'Buy POS Machine, Thermal Printer, Scanner & Billing Software',
    description: truncateDescription(
      'Shop ATPOS POS systems, 58mm/80mm thermal receipt printers, barcode label printers, 2D scanners, cash drawers and GST billing software. Prices in India, GST invoice from Noida.'
    ),
    keywords: joinKeywords(DEFAULT_KEYWORDS, [
      'buy POS machine online',
      'thermal printer price India',
    ]),
    path: '/products',
    listName: 'All products',
  };
};

export const SITEMAP_CATEGORIES = Object.keys(CATEGORY_SEO);
export const SITEMAP_FILTERS = [{ type: 'hardware' }];
