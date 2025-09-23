import React from 'react';
import HeroBannerSplitLayout from './hero-banner-split-layout';
import Authors from './authors';
import CTA from './cta';
import RelatedArticles from './related-article';
import { ArticleComponent } from "../../typescript/component";
import Hero from './hero/Hero';
import { AdditionalParam } from "../../typescript/component";


type RenderArticleComponentsProps = {
  articleComponents: ArticleComponent[];
  contentTypeUid: string;
  entryUid: string;
  locale: string;
  articleTitle?: string;
  articleDate?: string;
  pageData: any;
  $?: AdditionalParam;
};

export default function RenderArticleComponents(props: RenderArticleComponentsProps) {
  const { articleComponents, contentTypeUid, entryUid, locale, articleTitle, articleDate,pageData } = props;

  return (
    <div
      data-pageref={entryUid}
      data-contenttype={contentTypeUid}
      data-locale={locale}
    >
      {Object.values(articleComponents)?.map((component, key: number) => {
        if (component.hero_banner_split_layout) {
          return (
            <HeroBannerSplitLayout
              heroBanner={component.hero_banner_split_layout}
              key={`component-${key}`}
              pageData= { pageData}
            />
          );
        }
        if (component.authors) {
          return (
            <Authors
              authors={component.authors}
              key={`component-${key}`}
            />
          );
        }
        if (component.cta) {
          return (
            <CTA
              cta={component.cta}
              key={`component-${key}`}
            />
          );
        }
        if (component.related_articles) {
          return (
            <RelatedArticles
              relatedArticles={component.related_articles}
              key={`component-${key}`}
              $={component.$?.related_articles}
            />
          );
        }

        if (component?.summary?.summary) {
          console.log("component.summary:", component.summary);
          return (
            <div
              className="body-summary"
              dangerouslySetInnerHTML={{ __html: component.summary.summary }}
            />
          );
        }
        
        if (component.hero) {
          const heroData = {
            ...component.hero,
            title: articleTitle || component.hero.title,
            date: articleDate || component.hero.date,
          };
          return (
            <Hero
              hero={heroData}
              key={`component-${key}`}
              pageData={pageData}
            />
          );
        }
        return null;
      })}
    </div>
  );
}