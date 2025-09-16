import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPosts } from '../../../typescript/pages';

type ArticleCardProps = {
  article: BlogPosts;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  if (!article) {
    return null;
  }

  return (
    <>
      <Link href={article.url || '#'} className="article-card-link">
        <div className="article-card">
          {article.featured_image && (
            <div className="article-card-image-wrapper">
              <Image
                src={article.featured_image.url}
                alt={article.featured_image.title}
                width={300} // Adjust as needed
                height={200} // Adjust as needed
                className="article-card-image"
              />
            </div>
          )}
          <div className="article-card-content">
            {article.title && <h4 className="article-card-title">{article.title}</h4>}
            {article.date && (
              <p className="article-card-date">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      </Link>
      <style jsx>{`
        .article-card-link {
          text-decoration: none;
          color: inherit;
        }
        .article-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
          margin-bottom: 20px;
        }
        .article-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .article-card-image-wrapper {
          width: 100%;
          height: 200px;
          position: relative;
        }
        .article-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .article-card-content {
          padding: 15px;
        }
        .article-card-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #333;
        }
        .article-card-date {
          font-size: 0.9rem;
          color: #777;
        }
      `}</style>
    </>
  );
}