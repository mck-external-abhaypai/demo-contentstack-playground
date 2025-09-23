import React from 'react';

type CTAProps = {
  cta: {
    componenet_title: string;
    cta: {
      title: string;
      href: string;
    };
    _metadata: {
      uid: string;
    };
    $?: {
      componenet_title?: string;
      cta?: {
        title?: string;
      };
    };
  };
};

export default function CTA({ cta }: CTAProps) {
  if (!cta) {
    return null;
  }

  return (
    <div className="cta-section">
      {/* Title Section */}
      <div className="cta-title">
        <h3 {...(typeof cta.$?.componenet_title === 'object' ? cta.$.componenet_title : {})}>{cta.componenet_title}</h3>
      </div>
      
      {/* CTA Button */}
      <div className="cta-button-wrapper">
        <a 
          href={cta.cta.href} 
          className="cta-button"
          target="_blank"
          rel="noopener noreferrer"
          {...(cta.cta.$?.title ?? {})}
        >
          {cta.cta.title}
        </a>
      </div>
    </div>
  );
}