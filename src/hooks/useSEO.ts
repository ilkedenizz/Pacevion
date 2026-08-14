import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: string;
}

export function useSEO({ title, description, canonicalPath, ogType = 'website' }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const canonicalUrl = `https://ilkedenizz.github.io/Pacevion${canonicalPath}`;
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);

    const ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (ogTypeMeta) ogTypeMeta.setAttribute('content', ogType);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);

    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute('content', canonicalUrl);
  }, [title, description, canonicalPath, ogType]);
}
