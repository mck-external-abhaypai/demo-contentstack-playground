import { Action, Image } from "./action";

type AdditionalParam = {
  title: string;
  title_h2: string;
  title_h3: string;
  description: string;
  banner_title: string;
  banner_description: string;
  designation: string;
  name: string;
  html_code: string;
  body: string;
  date: string;
  uid?: string; // Added uid as it's used in authors.tsx
}

type Employee = {
  image: Image;
  name: string;
  designation: string;
  $: AdditionalParam;
}

type BucketList = [
  BucketArray:{
    title_h3: string;
    description: string;
    url: string;
    call_to_action: Action;
    icon: Image;
    $: AdditionalParam;
  }
]

type Card = [
  cardArray: {
    title_h3: string;
    description: string;
    call_to_action: Action;
    $: AdditionalParam;
    }
]

type Article = {
  href: string;
  title: string;
  $: AdditionalParam;
}

type FeaturedBlog = [
  BlogArray: {
    title: string;
    featured_image: Image;
    body: string;
    url: string;
    $: AdditionalParam;
  }
]

type Widget = {
  title_h2: string;
  type?: string;
  $: AdditionalParam;
}

// New types for Article Components
export type HeroBannerSplitLayoutType = {
  title: string;
  description: string;
  image: {
    url: string;
    title: string;
  };
  date: string;
  author: AuthorsType[];
  social_links?: any; // Placeholder for social links
  // Add more properties as needed based on your Contentstack entry structure
  $?: AdditionalParam;
};

export type HeroComponentType = {
  title: string;
  date: string;
  image: {
    url: string;
    title: string;
  };
  $?: {
    title?: string;
    date?: string;
  };
};

export type AuthorsType = {
  uid: string;
  title: string;
  bio: string;
  picture: Image;
  $?: AdditionalParam;
};

export type CTAType = {
  title: string;
  url: string;
  // Add more properties as needed
  $?: AdditionalParam;
};

export type RelatedArticlesType = {
  title: string;
  url: string;
  // Add more properties as needed
  $?: AdditionalParam;
};

export type ArticleComponent = {
  hero_banner_split_layout?: HeroBannerSplitLayoutType;
  authors?: AuthorsType[];
  cta?: CTAType;
  related_articles?: RelatedArticlesType[];
};

export type Component = {
  hero_banner: Banner;
  section?: SectionProps;
  section_with_buckets?: SectionWithBucket;
  from_blog?: FeaturedBlogData;
  section_with_cards?: Cards;
  section_with_html_code?: AdditionalParamProps;
  our_team?: TeamProps;
  widget?: Widget;
  hero?: HeroComponentType;
}

export type SectionWithBucket = {
    bucket_tabular: boolean
    title_h2: string;
    buckets: BucketList;
    description: string;
    $: AdditionalParam;
  }

export type Cards = {
    cards: Card;
  }
  
export type Banner = {
    banner_title:string;
    banner_description: string;
    bg_color: string;
    call_to_action: Action;
    banner_image: Image;
    text_color: string;
    $: AdditionalParam;
  }
  
export type AdditionalParamProps = {
    html_code_alignment: string;
    title: string;
    $: AdditionalParam;
    description: string;
    html_code: string;
  }
  
export type SectionProps = {
    title_h2: String;
    description: string;
    call_to_action: Action;
    image: Image;
    image_alignment: string;
    $: AdditionalParam;
  } 
  
export type TeamProps = {
    title_h2: string;
    description: string;
    $: AdditionalParam;
    employees: [Employee];
  }
  
export type FeaturedBlogData = {
    title_h2: string;
    view_articles: Article;
    featured_blogs: FeaturedBlog;
    $: AdditionalParam;
}

export type RenderProps = {
  blogPost?: boolean;
  contentTypeUid: string;
  entryUid: string;
  locale: string;
  pageComponents: (Component | ArticleComponent)[];
  articleTitle?: string;
  articleDate?: string;
  pageData?: any;
  body?: string;
}