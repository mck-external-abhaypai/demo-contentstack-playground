import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { onEntryChange } from '../contentstack-sdk';
import RenderComponents from '../components/render-components';
import { getPageRes } from '../helper';
import Skeleton from 'react-loading-skeleton';
import { Props } from "../typescript/pages";
import { DEFAULT_LOCALE } from "../config/localization";

export default function Page(props: Props) {
  const { page, entryUrl } = props;
  const router = useRouter();
  const [getEntry, setEntry] = useState(page);

  async function fetchData() {
    try {
      const locale = router.locale || DEFAULT_LOCALE;
      const entryRes = await getPageRes(entryUrl, locale);
      if (!entryRes) throw new Error('Status code 404');
      setEntry(entryRes);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [page]);

  return getEntry.page_components ? (
    <RenderComponents
      pageComponents={getEntry.page_components}
      contentTypeUid='page'
      entryUid={getEntry.uid}
      locale={getEntry.locale}
    />
  ) : (
    <Skeleton count={3} height={300} />
  );
}

export async function getServerSideProps({ params, locale }: any) {
  try {
    const entryUrl = '/' + params.page.join('/')
    const currentLocale = locale || DEFAULT_LOCALE;
    const entryRes = await getPageRes(entryUrl, currentLocale)
    if (!entryRes) throw new Error('404')
    return {
      props: {
        entryUrl,
        page: entryRes,
      },
    }
  } catch (error) {
    return { notFound: true }
  }
}
