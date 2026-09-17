import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getAllPosts } from '../data/blogPosts';
import { breadcrumbSchema, blogListSchema, webPageSchema } from '../utils/structuredData';
import { joinKeywords, PAGE_KEYWORDS } from '../config/site';

const Blog = () => {
  const posts = getAllPosts();

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO
        title="POS & Printer Guides — Blog"
        description="Practical guides on thermal printers, POS machines, GST billing software, ATPOS drivers and label sizes for shops in India. Written by BillingZone, Noida."
        keywords={joinKeywords(PAGE_KEYWORDS.home, [
          'POS blog',
          'thermal printer guide',
          'billing machine tips',
          'ATPOS driver guide',
        ])}
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
          webPageSchema({
            name: 'BillingZone POS guides',
            description: 'Blog with printer and POS buying guides for Indian retailers.',
            path: '/blog',
          }),
          blogListSchema(posts),
        ]}
      />

      <div className="bg-[#f4f7f9] border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#006699] mb-3">
            BillingZone insights
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            POS & printer guides
          </h1>
          <p className="mt-4 text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Setup tips, driver help and buying advice for restaurants, kirana and retail — from our
            team in Noida. SEO-powered guides linked to real products and drivers on this site.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <ul className="space-y-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <Link to={`/blog/${post.slug}`} className="block p-6 md:p-8 group">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                  <span className="text-[#006699]">{post.category}</span>
                  <span>·</span>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span>·</span>
                  <span>{post.readMinutes} min read</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-[#006699] transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-4 text-sm font-bold text-[#006699] uppercase tracking-wide">
                  Read guide →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
