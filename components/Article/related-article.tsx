import React, { useState, useEffect } from 'react';
import { BlogPosts } from '../../typescript/pages';
import { getArticleByUid }  from '../../helper';
import ArticleCard from './articleCard';

type RelatedArticlesProps = {
  relatedArticles: {
    title: string;
    related_articles: Array<{
      uid: string;
      content_type_uid: string;
      $: any;
    }>;
    $?: any;
  };
};

export default function RelatedArticles({ relatedArticles }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<BlogPosts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
    const articlesArray = relatedArticles.related_articles;

    if (!articlesArray || !articlesArray.length) {
      setLoading(false);
      return;
    }

      try {
        setLoading(true);
        setError(null);
        // Fetch all articles in parallel
        const articlePromises = articlesArray.map(
          (articleRef) => getArticleByUid(articleRef.uid)
        );

        const fetchedArticles = await Promise.all(articlePromises);

        // Filter out any failed requests (null/undefined results)
        const validArticles = fetchedArticles.filter(article => article != null);

        setArticles(validArticles);
      } catch (err) {
        console.error('Error fetching related articles:', err);
        setError('Failed to load related articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [relatedArticles]);

  if (loading) {
    return (
      <div className="related-articles">
        <h3 {...(relatedArticles.$?.title ?? {})}>Related Articles</h3>
        <div className="loading">
          <p>Loading related articles...</p>
        </div>
        <style jsx>{`
          .loading {
            padding: 20px;
            text-align: center;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="related-articles">
        <h3 {...(relatedArticles.$?.title ?? {})}>Related Articles</h3>
        <div className="error">
          <p>{error}</p>
        </div>
        <style jsx>{`
          .error {
            padding: 20px;
            text-align: center;
            color: #d32f2f;
          }
        `}</style>
      </div>
    );
  }

  console.log("articles:", articles);
  return (
    <div className="related-articles">
      <h3 {...(relatedArticles.$?.title ?? {})}>Related Articles</h3>
      <div className="related-articles-grid">
        {articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <ArticleCard key={article.uid || index} article={article} />
          ))
        ) : (
          <div className="no-related">
            <p>No related articles available</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .related-articles {
          background-color: #f8f8f8; /* Light grey background */
          padding: 40px 0;
        }
        .related-articles h3 {
          text-align: center;
          text-transform: uppercase;
          color: #000;
          font-size: 1.5rem;
          margin-bottom: 30px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .related-articles h3::after {
          content: '';
          display: block;
          width: 60px; /* Adjust width of the underline */
          height: 2px;
          background-color: #0070f3; /* Blue color */
          position: absolute;
          bottom: -10px; /* Distance from text */
          left: 50%;
          transform: translateX(-50%);
        }
        .related-articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, 300px); /* Fixed width for cards */
          justify-content: center; /* Center the cards */
          gap: 20px;
          max-width: 1200px; /* Limit width as seen in image */
          margin: 0 auto; /* Center the grid */
          padding: 0 20px;
        }
        .no-related {
          padding: 20px;
          text-align: center;
          color: #666;
        }
      `}</style>
    </div>
  );
}