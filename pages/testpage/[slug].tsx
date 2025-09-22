import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import parse from 'html-react-parser';
import { getPageRes, getTestPageRes } from '../../helper';
import { onEntryChange } from '../../contentstack-sdk';
import Skeleton from 'react-loading-skeleton';
import RenderComponents from '../../components/render-components';
import ArchiveRelative from '../../components/archive-relative';
import RenderRTE from '../../utils/renderRTE';
import { Page, TestPage, PageUrl } from "../../typescript/pages";
import { DEFAULT_LOCALE } from "../../config/localization";

export default function TestPagePost({ testPage, page, pageUrl }: { 
  testPage: TestPage, 
  page: Page | null, 
  pageUrl: PageUrl 
}) {
  const router = useRouter();
  const [getPost, setPost] = useState({ banner: page, post: testPage });

  async function fetchData() {
    try {
      const locale = router.locale || DEFAULT_LOCALE;
      const entryRes = await getTestPageRes(pageUrl, locale);
      const bannerRes = await getPageRes('/testpage', locale);
      if (!entryRes || !bannerRes) throw new Error('Status: ' + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [testPage]);

  const { post, banner } = getPost;

  console.log(post?.body_rte);

  return (
    <>
      {banner ? (
        <RenderComponents
          pageComponents={banner.page_components}
          contentTypeUid='test_page'
          entryUid={banner?.uid}
          locale={banner?.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='test-page-container'>
        <article className='test-page-detail'>
          {post && post.title ? (
            <h2 {...post.$?.title as {}}>{post.title}</h2>
          ) : (
            <h2>
              <Skeleton />
            </h2>
          )}
          {post && post.date ? (
            <p {...post.$?.date as {}}>
              {moment(post.date).format('ddd, MMM D YYYY')},{' '}
              <strong {...post.author[0].$?.title as {}}>
                {post.author[0].title}
              </strong>
            </p>
          ) : (
            <p>
              <Skeleton width={300} />
            </p>
          )}
          {post && post.body ? (
            <div {...post.$?.body as {}}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={400} width={600} />
          )}
          {post && post.body_rte ? (
            <div {...post.$?.body_rte as {}}>
              <RenderRTE content={post.body_rte} />
            </div>
          ) : (
            <Skeleton height={400} width={600} />
          )}
        </article>
        <div className='test-page-column-right'>
          <div className='related-test-page'>
            {banner && banner?.page_components[2] && banner?.page_components[2].widget ? (
              <h2 {...banner?.page_components[2].widget.$?.title_h2 as {}}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_test_page ? (
              <ArchiveRelative
                {...post.$?.related_test_page}
                blogs={post.related_test_page}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ params, locale }: any) {
  try {
    const currentLocale = locale || DEFAULT_LOCALE;
    const entryUrl = `/testpage/${params.slug}`;
    
    console.log('🔍 Trying to fetch test page at URL:', entryUrl);
    
    // Try to get the test page content first
    const testPage = await getTestPageRes(entryUrl, currentLocale);
    
    // If test page exists, try to get the banner page, fallback if it doesn't exist
    let page;
    try {
      page = await getPageRes('/testpage', currentLocale);
    } catch (bannerError) {
      console.log('⚠️ Banner page not found, using test page as fallback');
      page = null;
    }
    
    if (!testPage) {
      console.error('❌ Test page not found at:', entryUrl);
      throw new Error('404');
    }

    console.log('✅ Successfully found test page:', testPage.title);

    return {
      props: {
        pageUrl: entryUrl,
        testPage: testPage,
        page: page || null,
      },
    };
  } catch (error) {
    console.error('🚨 getServerSideProps error:', error);
    return { notFound: true };
  }
}
