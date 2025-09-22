import React from 'react';

interface SimpleCardProps {
  readonly title: string;
  readonly description: string;
  readonly url: string;
}

const SimpleCard: React.FC<SimpleCardProps> = ({ title, description, url }) => {
  return (
    <div className="simple-card">
      <div className="simple-card-content">
        <h3 className="simple-card-title">
            {title}
        </h3>
        <p className="simple-card-description">
          {description}
        </p>
        <img src={url} alt={title} className="simple-card-read-more" />
      </div>
    </div>
  );
};

export default SimpleCard;
