import React from 'react';
import { Link } from 'react-router-dom';

const BlogArticleBody = ({ blocks }) => {
  if (!blocks?.length) return null;

  return (
    <article className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-[#006699]">
      {blocks.map((block, index) => {
        if (block.type === 'h2') {
          return (
            <h2 key={index} className="text-xl font-bold mt-8 mb-3 text-slate-900">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'p') {
          return (
            <p key={index} className="text-gray-700 leading-relaxed mb-4 text-[15px]">
              {block.text}
            </p>
          );
        }
        if (block.type === 'ul') {
          return (
            <ul key={index} className="list-disc pl-6 mb-4 space-y-2 text-gray-700 text-[15px]">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'ol') {
          return (
            <ol key={index} className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 text-[15px]">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        }
        return null;
      })}
    </article>
  );
};

export const BlogRelatedLinks = ({ links }) => {
  if (!links?.length) return null;
  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
        Related on BillingZone
      </h3>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm font-semibold text-[#006699] border border-[#006699]/30 px-4 py-2 hover:bg-[#006699] hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogArticleBody;
