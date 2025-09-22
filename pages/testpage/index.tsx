import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { onEntryChange } from '../../contentstack-sdk';
import RenderComponents from '../../components/render-components';
import { getPageRes, getTestPageListRes } from '../../helper';
import ArchiveRelative from '../../components/archive-relative';
import Skeleton from 'react-loading-skeleton';
import { Page, TestPage as TestPageType, PageUrl, Context } from "../../typescript/pages";
import { DEFAULT_LOCALE } from "../../config/localization";

// Create a test page list component similar to BlogList
const TestPageList = ({ testPageList }: { readonly testPageList: TestPageType }) => {
  return (
    <div className="test-page-wrap">
      <div className="test-page-detail">
        <div className="test-page-meta">
          <p {...testPageList.$?.date as {}}>
            {new Date(testPageList.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
        <h2 {...testPageList.$?.title as {}}>
          <a href={testPageList.url}>{testPageList.title}</a>
        </h2>
        <div {...testPageList.$?.body as {}}>
          {testPageList.body?.slice(0, 150)}...
        </div>
        <div className="test-page-author">
          {testPageList.author?.[0] && (
            <p {...testPageList.author[0].$?.title as {}}>
              <strong>By: {testPageList.author[0].title}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TestPage({ page, testPages, archiveTestPages, pageUrl }: { 
  readonly page: Page, 
  readonly testPages: TestPageType[], 
  readonly archiveTestPages: TestPageType[], 
  readonly pageUrl: PageUrl 
}) {
  const router = useRouter();
  const [getBanner, setBanner] = useState(page);

  async function fetchData() {
    try {
      const locale = router.locale || DEFAULT_LOCALE;
      const bannerRes = await getPageRes(pageUrl, locale);
      if (!bannerRes) throw new Error('Status code 404');
      setBanner(bannerRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, []);

  return (
    <>
      {getBanner.page_components ? (
        <RenderComponents
          pageComponents={getBanner.page_components}
          contentTypeUid='page'
          entryUid={getBanner.uid}
          locale={getBanner.locale}
        />
      ) : (
        <Skeleton height={400} />
      )}
      <div className='test-page-container'>
        <div className='test-page-column-left'>
          {testPages ? (
            testPages.map((testPageList) => (
              <TestPageList testPageList={testPageList} key={testPageList.uid} />
            ))
          ) : (
            <Skeleton height={400} width={400} count={3} />
          )}
        </div>
        <div className='test-page-column-right'>
          {getBanner?.page_components?.[1]?.widget && (
            <h2>{getBanner.page_components[1].widget.title_h2}</h2>
          )}
          {archiveTestPages ? (
            <ArchiveRelative blogs={archiveTestPages} />
          ) : (
            <Skeleton height={600} width={300} />
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: Context) {
  try {
    const locale = context.locale || DEFAULT_LOCALE;
    const page = await getPageRes(context.resolvedUrl, locale);
    const result = await getTestPageListRes(locale);

    const archiveTestPages = [] as TestPageType[];
    const testPages = [] as TestPageType[];
    result.forEach((testPage) => {
      if (testPage.is_archived) {
        archiveTestPages.push(testPage);
      } else {
        testPages.push(testPage);
      }
    });

    return {
      props: {
        pageUrl: context.resolvedUrl,
        page,
        testPages,
        archiveTestPages,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
