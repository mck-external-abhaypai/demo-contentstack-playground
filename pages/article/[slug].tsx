'use client'
import { useEffect, useState } from 'react'
import { Text } from '@/components/Text/Text'
import { Page } from '@/types'
import { ImageCardItem } from '@/types/components'
import { PageWrapper } from '@/components/common/PageWrapper'
import { ArticleCover } from '@/components/Article/ArticleCover'
import { RelatedLinks } from '@/components/Article/RelatedLinks'
import { NotFoundComponent } from '@/components/common/404'
import { onEntryChange } from '@/config'
import { getPersonalizeAttribute, isDataInLiveEdit, removeSpecialChar } from '@/utils'
import useRouterHook from '@/hooks/useRouterHook'
import { setDataForChromeExtension } from '@/utils'
import { usePersonalization } from '@/context'
import { articleJSONRtePathIncludes } from '@/services/helper'
import { getEntries, getEntryByUrl } from '@/services'
import RenderArticleComponents from '@/components/Article/RenderArticleComponent'

/**
 * @component Article - Article Component (Slug Based)
 *
 * @route '/article/{slug}'
 * @description Component that renders the article page based on the slug
 *
 * @returns {JSX.Element}
 */
export default function Article() {
  const { personalizationSDK, personalizeConfig } = usePersonalization()
  const [data, setData] = useState<Page.ArticlePage['entry'] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [articles, setArticles] = useState<Page.ArticlePage['articles'] | null>(null)
  const [relatedLinks, setRelatedLinks] = useState<Page.ArticleListingPage['entry'][] | []>([])
  const { path, locale } = useRouterHook()

  const taxonomy_path = personalizeConfig?.taxonomy_path

  /**
   * useEffect that sets the required attributes for personalization
   */
  useEffect(() => {
    const setAttribute = async () => {
      if (!data) return
      const audiences = personalizeConfig?.audiences
      const criteria =
        taxonomy_path?.toLowerCase() === data?.taxonomies?.[0]?.taxonomy_uid.toLowerCase()
          ? data?.taxonomies?.[0]?.term_uid.toLowerCase()
          : data?.taxonomies?.[1]?.term_uid.toLowerCase()
      const attributes = getPersonalizeAttribute(audiences, removeSpecialChar(String(criteria)))
      await personalizationSDK?.set({ ...attributes })
    }

    if (personalizeConfig) setAttribute()
  }, [personalizeConfig, taxonomy_path, data, personalizationSDK])

  /**
   * @method fetchData
   * @description method to fetch the article data based on the slug
   *
   * @async
   */
  const fetchData = async () => {
    try {
      const jsonRtePaths = [...articleJSONRtePathIncludes]
      console.log('🔎 Fetching entry for path:', path, 'locale:', locale)
      
      // Debug environment config
      console.log('🔧 Environment check:', {
        hasPersonalizationSDK: !!personalizationSDK,
        pathType: typeof path,
        localeType: typeof locale,
        jsonRtePathsLength: jsonRtePaths.length
      })
      
      // Strip query parameters from path for URL matching
      const cleanPath = path?.split('?')[0] || path

      // Try different URL formats to see which one works
      const urlVariants = [
        cleanPath,                        // just the slug
        `/article${cleanPath}`,           // full path
      ]

      let entryData = null
      let lastError = null

      for (const urlVariant of urlVariants) {
        try {
          entryData = (await getEntryByUrl(
            'article',
            locale ?? 'en-us',
            urlVariant,
            [],
            jsonRtePaths,
            personalizationSDK
          )) as Page.ArticlePage['entry']
          
          if (entryData) {
            console.log('✅ Found entry with URL:', urlVariant)
            break
          }
        } catch (error: any) {
          console.log('Error details:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
          })
          lastError = error
          continue
        }
      }

      if (!entryData) {
        throw lastError || '404'
      }

      setData(entryData)
      setDataForChromeExtension({
        entryUid: entryData?.uid || '',
        contenttype: 'article',
        locale: locale || 'en-us'
      })
      setLoading(false)
    } catch (err) {
      console.error('🚀 ~ fetchData error:', err)
      setLoading(false)
    }
  }

  /**
   * @method fetchArticles
   * @description method to fetch the related articles based on the current article's taxonomy data
   *
   * @async
   */
  const fetchArticles = async () => {
    try {
      if (data && data?.taxonomies?.length > 0) {
        if (data.show_related_links) {
          const filterQuery = data.taxonomies?.map((elem) => ({
            url: `/articles/${elem.taxonomy_uid}/${elem.term_uid.replaceAll('_', '-')}` as string
          }))

          const listingData = (await getEntries(
            'article_listing_page',
            locale ?? 'en-us',
            [],
            [],
            {
              queryOperator: 'or',
              filterQuery
            },
            personalizationSDK
          )) as Page.ArticleListingPage['entry'][]

          listingData && setRelatedLinks(listingData)
        }

        if (data.show_related_articles) {
          const groupedData = data.taxonomies?.reduce((acc, { taxonomy_uid, term_uid }) => {
            acc[taxonomy_uid] = acc[taxonomy_uid] || []
            acc[taxonomy_uid].push(term_uid)
            return acc
          }, {} as Record<string, string[]>)

          const filterQuery = Object.entries(groupedData || {}).map(([taxonomy_uid, term_uids]) => ({
            [`taxonomies.${taxonomy_uid}`]: term_uids
          }))

          const articlesData = await getEntries<Page.ArticlePage['articles'][]>(
            'article',
            locale || 'en-us',
            [],
            [],
            {
              queryOperator: 'or',
              filterQuery
            },
            personalizationSDK
          )

          const filteredArticles = articlesData?.filter((article) => article.uid !== data?.uid)
          filteredArticles && setArticles(filteredArticles as any)
        }
      } else {
        setRelatedLinks([])
        setArticles([])
      }
    } catch (err) {
      console.error('🚀 ~ fetchArticles error:', err)
      setArticles([])
    }
  }

  /**
   * useEffect that handles data fetching on pageLoad and live preview
   */
  useEffect(() => {
    if (path && locale) {
    fetchData();
    onEntryChange(fetchData);
  }
  }, [path, locale])

  /**
   * useEffect that handles fetching of related articles
   */
  useEffect(() => {
    fetchArticles()
  }, [data])

  const {
    body,
    content,
    title,
    cover_image,
    show_related_links,
    related_links,
    show_related_articles,
    related_articles,
    page_components,
    uid,
    $
  } = data || {}


  const cards: ImageCardItem[] | [] = (articles?.map((article) => {
    return {
      title: article?.title,
      content: article?.summary,
      image: article?.cover_image,
      $: article?.$,
      cta: { href: article?.url || '#', title: 'Read More' }
    }
  }) || []) as ImageCardItem[]

  const relatedArticles =
    cards && cards.splice(0, data?.related_articles?.number_of_articles ?? 6)

  return data ? (
    <div className="min-h-screen bg-white">
      <PageWrapper {...data}>
        {/* Hero Section with Background Image */}
       

        {/* Article Cover Component */}
        <div className="bg-white py-8">
          <div>
            <ArticleCover
              title={title}
              summary={''}
              cover_image={cover_image}
              $={$}
              _content_type_uid={'article'}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* Article Content */}
              <div className="lg:col-span-3">
                <div className="max-w-4xl mx-auto">
                  <article className="prose prose-lg prose-slate max-w-none">
                    <div className="text-lg leading-relaxed text-gray-700 space-y-6">
                      <Text content={content} $={$} id={'article-content'} />
                      {(!content || !content.trim()) && isDataInLiveEdit() && (
                        <div className="space-y-4 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg" {...$?.content}>
                          <div className="text-center text-gray-500 text-sm mb-4">
                            Content Placeholder - This will only appear in the visual editor
                          </div>
                          <p>
                            Welcome to Amsterdam, a city where history flows through every canal and culture blooms
                            on every corner. This enchanting Dutch capital offers visitors an unforgettable journey
                            through centuries of art, architecture, and innovation.
                          </p>
                          <p>
                            From the world-renowned museums housing masterpieces by Van Gogh and Rembrandt to the
                            charming neighborhoods lined with historic townhouses, Amsterdam presents a perfect blend
                            of old-world charm and modern sophistication.
                          </p>
                          <p>
                            Take a leisurely cruise along the UNESCO World Heritage canals, explore the vibrant local
                            markets, or simply enjoy a coffee at one of the many canal-side cafés. Each experience in
                            Amsterdam tells a story of resilience, creativity, and the enduring Dutch spirit.
                          </p>
                          <p>
                            Whether you're interested in art, history, cycling, or simply soaking in the unique
                            atmosphere of this remarkable city, Amsterdam promises memories that will last a lifetime.
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              </div>

              {/* Sidebar */}
             
            </div>
          </div>
        </div>
        
        <RenderArticleComponents
          articleComponents={page_components}
          contentTypeUid={"article"}
          entryUid={uid || ''}
          locale={locale || 'en-us'}
          pageData={page_components}
          articleTitle={page_components[2]?.related_articles.title}
          key={`component-${'article'}`}
        />

        {/* Related Links Section */}
        {data?.taxonomies?.length > 0 && show_related_links && (
          <div className="mt-16 py-12 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <RelatedLinks
                relatedLinks={relatedLinks}
                relatedLinksLabel={related_links}
                $={data?.$}
              />
            </div>
          </div>
        )}

        {/* Related Articles Section */}
        {show_related_articles && relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-16">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <RelatedArticles 
                related_articles={related_articles} 
                cards={relatedArticles} 
              />
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {!loading && !isDataInLiveEdit() && <NotFoundComponent />}
      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      )}
    </div>
  )
}
