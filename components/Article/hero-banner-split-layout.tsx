import React from 'react';
import Skeleton from 'react-loading-skeleton';

type Author = {
  uid: string;
  title: string;
  $?: {
    title?: string;
  };
};

type PageData = {
  author?: Author[];
};

type HeroBannerSplitLayoutProps = {
  heroBanner: {
    image: {
      url: string;
      title: string;
    };
    subtitle: string;
    layout_type: string;
    date?: string;
    social_links?: any;
    $?: {
      subtitle?: string;
      date?: string;
    };
  };
  pageData: PageData;
};

export default function HeroBannerSplitLayout({ 
  heroBanner, 
  pageData 
}: HeroBannerSplitLayoutProps) {
  return (
    <>
      <div className={`hero-banner-split-layout ${
        heroBanner.layout_type === 'Image Right' ? 'image-right' : 'image-left'
      }`}>
        <div className="hero-banner-content">
          <div className="content-wrapper">
            <h1 {...(heroBanner.$?.subtitle ?? {})}>{heroBanner.subtitle}</h1>
            {heroBanner.date && (
              <p className="date-text" {...(heroBanner.$?.date ?? {})}>
                {new Date(heroBanner.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} | Article
              </p>
            )}
          </div>
        </div>
        <div className="hero-banner-image">
          {heroBanner.image && (
            <img src={heroBanner.image.url} alt={heroBanner.image.title} />
          )}
        </div>
      </div>

      <div className="authors-actions-section">
        <div className="container">
          <div className="authors-actions-wrapper">
            <div className="authors-info">
              {pageData.author && pageData.author.length > 0 ? (
                <div className="authors-list">
                  <span className="by-label">By </span>
                  {pageData.author.map((author, index) => (
                    <React.Fragment key={author.uid}>
                      <a
                        href={`/author/${author.uid}`}
                        className="author-name"
                        {...(author.$?.title ?? {})}
                      >
                        {author.title}
                      </a>
                      {index < (pageData.author?.length ?? 0) - 1 && (
                        <span className="author-separator"> and </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <Skeleton width={200} height={20} />
              )}
            </div>
            
            <div className="article-actions">
              <button className="action-btn" title="Share">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <span>Share</span>
              </button>
              <button className="action-btn" title="Print">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <polyline points="6,9 6,2 18,2 18,9"/>
                  <path d="m6,18h4v4h8v-4h4s2,-2 2,-6-2,-6-2,-6h-16s-2,2-2,6 2,6 2,6z"/>
                  <polyline points="6,14 18,14"/>
                </svg>
                <span>Print</span>
              </button>
              <button className="action-btn" title="Download">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Download</span>
              </button>
              <button className="action-btn" title="Save">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M12 8v8m-4-4h8"/>
                </svg>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}