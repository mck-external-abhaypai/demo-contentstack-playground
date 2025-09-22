import { Component } from "../typescript/component";
import { Image } from "../typescript/action";
import { Entry, HeaderProps ,FooterProps } from "./layout";

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
  uid:string;
  related_post: [];
  copyright: string;
  announcement_text: string;
  label: {};
  url: string;
  _content_type_uid: string;
}

type Post = {
  url: string;
  is_archived: boolean;
  body: string;
  featured_image: Image;
  title: string;
  date: string;
  author: [Author];
  $: AdditionalParam;
}

export type Author = {
  title: string;
  uid: string;
  bio: string;
  picture: Image;
  $: AdditionalParam;
}

type PageProps = {
  page: Page;
  posts: [];
  archivePost: []; 
  blogPost: BlogPosts;
}

type Seo = {
  enable_search_indexing: boolean
}

export type Blog = {
  url?: string;
  body?: string;
  title: string;
  featured_image?: Image;
  $: AdditionalParam;
}

export type Props = {
  page: Page;
  entryUrl: string;
  Component: any;
  entries: Entry;
  pageProps: PageProps;
  header: HeaderProps;
  footer: FooterProps;
}

export type Page ={
  page_components: Component[];
  uid: string;
  locale: string;
  url: string;
  seo: Seo;
  title: string;
}

export type Context = {
  locale: string;
  resolvedUrl: string;
  setHeader: Function;
  write: Function;
  end: Function;
}

export type Pages = [
  page: Page
]

export type PostPage = [
  post: Post
]

export type PageUrl = string;

export type BlogPosts = {
  title: string;
  date: string;
  body: string;
  author: [Author];
  related_post: [Blog];
  locale: string;
  featured_image: Image;
  is_archived: boolean;
  seo: Seo;
  uid:string;
  url: string;
  _owner: string;
  _content_type_uid: string;
  $?: AdditionalParam & {
    body?: string;
  };
}

export type TestPage = {
  title: string;
  date: string;
  body: string;
  body_rte: string;
  author: [Author];
  related_test_page: [TestPageReference];
  locale: string;
  featured_image: Image;
  is_archived: boolean;
  seo: Seo;
  uid: string;
  url: string;
  _owner: string;
  _content_type_uid: string;
  $?: AdditionalParam & {
    body?: string;
    body_rte?: string;
    related_test_page?: any;
  };
}

export type TestPageReference = {
  url?: string;
  body?: string;
  title: string;
  featured_image?: Image;
  $: AdditionalParam;
}