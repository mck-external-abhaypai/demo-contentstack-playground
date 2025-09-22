import React from 'react';
import parse, { DOMNode, Element } from 'html-react-parser';
import SimpleCard from '../components/SimpleCard';
import { getEntryByUidHelper } from '../helper';

// Function to get entry data by UID from Contentstack
const getEntryByUid = async (uid: string, contentType: string, locale: string) => {
  try {
    console.log('🔍 Fetching embedded entry:', { uid, contentType, locale });
    const entry = await getEntryByUidHelper(uid, contentType, locale);
    console.log('✅ Fetched entry data:', entry);
    
    // Map the entry data to SimpleCard props based on actual response structure
    const mappedData = {
      title: entry.title || `Entry ${uid}`,
      description: entry.description || `Exhibit content`,
      url: entry.image_src?.href || entry.url || `/entry/${uid}`
    };
    
    console.log('📋 Mapped data for SimpleCard:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('❌ Error fetching entry:', { uid, contentType, locale, error });
    throw error;
  }
};

// Cache for entry data to avoid multiple API calls
const entryCache = new Map<string, any>();

interface RenderRTEProps {
  content: string;
}

const RenderRTE: React.FC<RenderRTEProps> = ({ content }) => {
  const [processedContent, setProcessedContent] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    const processEmbeddedEntries = async () => {
      const options = {
        replace: (domNode: DOMNode) => {
          if (
            domNode instanceof Element &&
            domNode.name === 'span' &&
            domNode.attribs?.type === 'entry' &&
            domNode.attribs?.class?.includes('embedded-entry')
          ) {
            const uid = domNode.attribs['data-sys-entry-uid'];
            const contentType = domNode.attribs['data-sys-content-type-uid'];
            const locale = domNode.attribs['data-sys-entry-locale'] || 'en-us';

            if (uid && contentType) {
              // Create a unique key for caching
              const cacheKey = `${uid}-${contentType}-${locale}`;
              
              // Return a component that will fetch and render the entry
              return <EmbeddedEntry key={cacheKey} uid={uid} contentType={contentType} locale={locale} />;
            }
          }
        }
      };

      const parsedContent = parse(content, options);
      setProcessedContent(parsedContent);
    };

    processEmbeddedEntries();
  }, [content]);

  return <div>{processedContent}</div>;
};

// Component to handle individual embedded entries
const EmbeddedEntry: React.FC<{ uid: string; contentType: string; locale: string }> = ({ 
  uid, 
  contentType, 
  locale 
}) => {
  const [entryData, setEntryData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEntry = async () => {
      const cacheKey = `${uid}-${contentType}-${locale}`;
      
      // Check cache first
      if (entryCache.has(cacheKey)) {
        setEntryData(entryCache.get(cacheKey));
        setLoading(false);
        return;
      }

      try {
        const data = await getEntryByUid(uid, contentType, locale);
        entryCache.set(cacheKey, data);
        setEntryData(data);
      } catch (error) {
        console.error('Error fetching embedded entry:', error);
        setEntryData({
          title: 'Error loading content',
          description: 'Unable to load embedded content',
          url: '#'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [uid, contentType, locale]);

  if (loading) {
    return <div className="embedded-entry-loading">Loading...</div>;
  }

  if (!entryData) {
    return <div className="embedded-entry-error">Error loading embedded content</div>;
  }

  return (
    <SimpleCard
      title={entryData.title}
      description={entryData.description}
      url={entryData.url}
    />
  );
};

export default RenderRTE;
