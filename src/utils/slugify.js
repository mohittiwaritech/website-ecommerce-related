// src/utils/slugify.js

/**
 * Converts a string (e.g., product title) into an SEO-friendly slug.
 * @param {string} text
 * @returns {string}
 */
export const convertToSlug = (text) => {
  return text
    ? text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special characters except spaces/hyphens
        .replace(/\s+/g, '-')         // replace spaces with hyphens
        .replace(/-+/g, '-')          // replace multiple consecutive hyphens with one
        .trim()
    : '';
};

/**
 * Generates the full SEO-friendly URL for a product.
 * @param {object} product
 * @returns {string}
 */
export const getProductUrl = (product) => {
  if (!product) return '#';
  const id = product.id;
  const title = product.title || product.name || '';
  const slug = convertToSlug(title);
  return `/product/${id}${slug ? '-' + slug : ''}`;
};
