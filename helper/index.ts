import { addEditableTags } from "@contentstack/utils";
import { Page, BlogPosts, TestPage } from "../typescript/pages";
import getConfig from "next/config";
import { FooterProps, HeaderProps } from "../typescript/layout";
import { getEntry, getEntryByUrl } from "../contentstack-sdk";
import { DEFAULT_LOCALE } from "../config/localization";

const { publicRuntimeConfig } = getConfig();
const envConfig = typeof window === 'undefined' && process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;

const liveEdit = envConfig.CONTENTSTACK_LIVE_EDIT_TAGS === "true";

export const getHeaderRes = async (
  locale: string = DEFAULT_LOCALE
): Promise<HeaderProps> => {
  const response = (await getEntry({
    contentTypeUid: 'header',
    referenceFieldPath: ['navigation_menu.page_reference'],
    jsonRtePath: ['notification_bar.announcement_text'],
    locale
  })) as HeaderProps[][];

  liveEdit && addEditableTags(response[0][0], "header", true);
  return response[0][0];
};

export const getFooterRes = async (
  locale: string = DEFAULT_LOCALE
): Promise<FooterProps> => {
  const response = (await getEntry({
    contentTypeUid: 'footer',
    referenceFieldPath: undefined,
    jsonRtePath: ['copyright'],
    locale
  })) as FooterProps[][];
  liveEdit && addEditableTags(response[0][0], 'footer', true);
  return response[0][0];
};

export const getAllEntries = async (
  locale: string = DEFAULT_LOCALE
): Promise<Page[]> => {
  const response = (await getEntry({
    contentTypeUid: 'page',
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
    locale
  })) as Page[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, 'page', true));
  return response[0];
};

export const getPageRes = async (
  entryUrl: string,
  locale: string = DEFAULT_LOCALE
): Promise<Page> => {
  const response = (await getEntryByUrl({
    contentTypeUid: 'page',
    entryUrl,
    referenceFieldPath: ['page_components.from_blog.featured_blogs'],
    jsonRtePath: [
      'page_components.from_blog.featured_blogs.body',
      'page_components.section_with_buckets.buckets.description',
      'page_components.section_with_html_code.description'
    ],
    locale
  })) as Page[];
  liveEdit && addEditableTags(response[0], 'page', true);
  return response[0];
};

export const getBlogListRes = async (
  locale: string = DEFAULT_LOCALE
): Promise<BlogPosts[]> => {
  const response = (await getEntry({
    contentTypeUid: 'blog_post',
    referenceFieldPath: ['author', 'related_post'],
    jsonRtePath: ['body'],
    locale
  })) as BlogPosts[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, 'blog_post', true));
  return response[0];
};

export const getBlogPostRes = async (
  entryUrl: string,
  locale: string = DEFAULT_LOCALE
): Promise<BlogPosts> => {
  const response = (await getEntryByUrl({
    contentTypeUid: 'blog_post',
    entryUrl,
    referenceFieldPath: ['author', 'related_post'],
    jsonRtePath: ['body', 'related_post.body'],
    locale
  })) as BlogPosts[];
  liveEdit && addEditableTags(response[0], 'blog_post', true);
  return response[0];
};

export const getArticleByUid = async (
  uid: string,
  locale: string = DEFAULT_LOCALE
): Promise<BlogPosts> => {
  const response = (await getEntry({
    contentTypeUid: 'article',
    entryUid: uid,
    referenceFieldPath: ['author', 'related_post'],
    jsonRtePath: ['body', 'related_post.body'],
    locale
  })) as BlogPosts[];
  liveEdit && addEditableTags(response[0], 'article', true);
  return response[0];
};

export const getTestPageListRes = async (
  locale: string = DEFAULT_LOCALE
): Promise<TestPage[]> => {
  const response = (await getEntry({
    contentTypeUid: 'test_page',
    referenceFieldPath: ['author', 'related_test_page'],
    jsonRtePath: ['body', 'body_rte'],
    locale
  })) as TestPage[][];
  liveEdit &&
    response[0].forEach((entry) => addEditableTags(entry, 'test_page', true));
  return response[0];
};

export const getTestPageRes = async (
  entryUrl: string,
  locale: string = DEFAULT_LOCALE
): Promise<TestPage> => {
  const response = (await getEntryByUrl({
    contentTypeUid: 'test_page',
    entryUrl,
    referenceFieldPath: ['author', 'related_test_page'],
    jsonRtePath: ['body', 'body_rte', 'related_test_page.body'],
    locale
  })) as TestPage[];
  liveEdit && addEditableTags(response[0], 'test_page', true);
  return response[0];
};

export const getEntryByUidHelper = async (
  uid: string,
  contentTypeUid: string,
  locale: string = DEFAULT_LOCALE
): Promise<any> => {
  try {
    console.log('🔧 Helper: Fetching entry with params:', { uid, contentTypeUid, locale });
    
    const response = await getEntry({
      contentTypeUid,
      entryUid: uid,
      referenceFieldPath: undefined,
      jsonRtePath: undefined,
      locale
    });
    
    console.log('🔧 Helper: Raw response:', response);
    
    // The response is an array with the entry as the first element
    if (response && Array.isArray(response) && response.length > 0) {
      const entry = response[0];
      console.log('🔧 Helper: Found entry:', entry);
      liveEdit && addEditableTags(entry, contentTypeUid, true);
      return entry;
    }
    
    console.error('🔧 Helper: No entry found in response');
    throw new Error(`Entry not found: ${uid}`);
  } catch (error) {
    console.error('🔧 Helper: Error in getEntryByUidHelper:', error);
    throw error;
  }
};
