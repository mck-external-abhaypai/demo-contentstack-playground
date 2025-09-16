import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { Author as AuthorType } from "../../typescript/pages";

type AuthorsProps = {
  authors: {
    components_title: string;
    authors: AuthorType[];
    show_author_info: boolean;
    about_the_author_s_: string;
    _metadata: { uid: string };
    $?: {
      components_title?: string;
      about_the_author_s_?: string;
    };
  };
};

export default function Authors({ authors }: AuthorsProps) {
  if (!authors) {
    return <Skeleton width={200} height={20} />;
  }

  return (
    <div className="authors-info">
      {/* Title Section */}
      <div className="authors-title">
        <h3 {...(typeof authors.$?.components_title === 'object' && authors.$?.components_title ? authors.$?.components_title : {})}>{authors.components_title}</h3>
      </div>
      
      {/* Authors Content */}
      <div className="authors-content">
        {authors.about_the_author_s_ ? (
          <div 
            {...(typeof authors.$?.about_the_author_s_ === 'object' && authors.$?.about_the_author_s_ ? authors.$?.about_the_author_s_ : {})}
            dangerouslySetInnerHTML={{ 
              __html: authors.about_the_author_s_ 
            }} 
          />
        ) : (
          <Skeleton width={400} height={60} />
        )}
      </div>
    </div>
  );
}