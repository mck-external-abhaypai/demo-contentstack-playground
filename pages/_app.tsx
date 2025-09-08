import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import Layout from '../components/layout';
import { getHeaderRes, getFooterRes, getAllEntries } from '../helper';
import 'nprogress/nprogress.css';
import '../styles/third-party.css';
import '../styles/style.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Props } from "../typescript/pages";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { onEntryChange } from '@contentstack/live-preview-utils';
import { useEffect } from 'react';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;
const {
  CONTENTSTACK_API_KEY,
  CONTENTSTACK_ENVIRONMENT,
  CONTENTSTACK_LIVE_PREVIEW,
  CONTENTSTACK_PREVIEW_HOST,
  CONTENTSTACK_PREVIEW_TOKEN,
  CONTENTSTACK_MANAGEMENT_TOKEN,
} = envConfig;
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp(props: Props) {
  const { Component, pageProps, header, footer, entries } = props;
  const { page, posts, archivePost, blogPost } = pageProps;

  useEffect(() => {
    if (CONTENTSTACK_LIVE_PREVIEW === "true") {
      ContentstackLivePreview.init({
        stackDetails: {
          apiKey: CONTENTSTACK_API_KEY as string,
          environment: CONTENTSTACK_ENVIRONMENT as string,
          management_token: CONTENTSTACK_MANAGEMENT_TOKEN as string,
        },
        clientUrl: CONTENTSTACK_PREVIEW_HOST as string,
        ssr: false,
        enable: CONTENTSTACK_LIVE_PREVIEW === "true",
        mode: "builder",
      });
    }
  }, []);

  const metaData = (seo: any) => {
    const metaArr = [];
    for (const key in seo) {
      if (seo.enable_search_indexing) {
        metaArr.push(
          <meta
            name={
              key.includes('meta_')
                ? key.split('meta_')[1].toString()
                : key.toString()
            }
            content={seo[key].toString()}
            key={key}
          />
        );
      }
    }
    return metaArr;
  };
  const blogList: any = posts?.concat(archivePost);
  return (
    <>
      <Head>
        <meta
          name='application-name'
          content='Contentstack-Nextjs-Starter-App'
        />
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1'
        />
        <meta name='theme-color' content='#317EFB' />
        <title>Contentstack-Nextjs-Starter-App</title>
        {page?.seo && page.seo.enable_search_indexing && metaData(page.seo)}
      </Head>
      <Layout
        header={header}
        footer={footer}
        page={page}
        blogPost={blogPost}
        blogList={blogList}
        entries={entries}
      >
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);
  const header = await getHeaderRes();
  const footer = await getFooterRes();
  const entries = await getAllEntries();

  return { ...appProps, header, footer, entries };
};

export default MyApp;
