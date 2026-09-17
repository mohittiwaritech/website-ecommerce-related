import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { productsData } from '../src/data/productsData.js';
import { getProductUrl } from '../src/utils/slugify.js';
import { SITE_URL } from '../src/config/site.js';
import { SITEMAP_CATEGORIES, SITEMAP_FILTERS } from '../src/config/seo.js';

const lastmod = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/products', changefreq: 'daily', priority: '0.9' },
  { loc: '/drivers', changefreq: 'weekly', priority: '0.8' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.7' },
  { loc: '/terms', changefreq: 'yearly', priority: '0.3' },
  { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/refund', changefreq: 'yearly', priority: '0.3' },
  { loc: '/shipping', changefreq: 'yearly', priority: '0.3' },
];

const categoryRoutes = SITEMAP_CATEGORIES.map((category) => ({
  loc: `/products?category=${encodeURIComponent(category)}`,
  changefreq: 'weekly',
  priority: '0.85',
}));

const filterRoutes = SITEMAP_FILTERS.map(({ type }) => ({
  loc: `/products?type=${encodeURIComponent(type)}`,
  changefreq: 'weekly',
  priority: '0.85',
}));

const urls = [
  ...staticRoutes,
  ...categoryRoutes,
  ...filterRoutes,
  ...productsData.map((product) => ({
    loc: getProductUrl(product),
    changefreq: 'weekly',
    priority: '0.8',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outFile = resolve(process.cwd(), 'public', 'sitemap.xml');
writeFileSync(outFile, xml);
console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
