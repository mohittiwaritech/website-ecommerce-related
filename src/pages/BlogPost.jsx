import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import BlogArticleBody, { BlogRelatedLinks } from '../components/BlogArticleBody';
import { getPostBySlug, getAllPosts } from '../data/blogPosts';
import { articleSchema, breadcrumbSchema } from '../utils/structuredData';
import { joinKeywords } from '../config/site';
import NotFound from './NotFound';

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <NotFound />;
  }

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const otherPosts = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO
        title={post.title}
        description={post.metaDescription}
        keywords={joinKeywords(post.keywords)}
        type="article"
        path={`/blog/${post.slug}`}
        articlePublishedTime={post.publishedAt}
        articleModifiedTime={post.updatedAt}
        jsonLd={[
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <nav className="text-sm text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-[#006699]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-[#006699]">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 line-clamp-1">{post.category}</span>
        </nav>

        <header className="mb-8 border-b border-gray-100 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#006699] mb-3">
            {post.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <time dateTime={post.publishedAt}>Published {formatDate(post.publishedAt)}</time>
            {post.updatedAt !== post.publishedAt && (
              <time dateTime={post.updatedAt}>Updated {formatDate(post.updatedAt)}</time>
            )}
            <span>{post.readMinutes} min read</span>
          </div>
        </header>

        <BlogArticleBody blocks={post.blocks} />
        <BlogRelatedLinks links={post.relatedLinks} />

        <div className="mt-12 p-6 bg-[#f4f7f9] border border-gray-200">
          <p className="font-semibold text-slate-800">Need help choosing hardware?</p>
          <p className="text-sm text-gray-600 mt-2">
            Call <a href="tel:+919289024863" className="text-[#006699] font-semibold">+91 9289024863</a>
            {' '}or{' '}
            <Link to="/contact" className="text-[#006699] font-semibold">contact BillingZone</Link>
            {' '}in Noida.
          </p>
        </div>

        {otherPosts.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-bold text-slate-900 mb-6">More guides</h2>
            <ul className="space-y-4">
              {otherPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="text-[#006699] font-semibold hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
