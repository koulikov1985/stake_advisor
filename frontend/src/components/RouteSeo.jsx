import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  SITE_NAME,
  SITE_URL,
  getRouteMetadata,
  normalizePath,
} from '../seo/routeMetadata';

function RouteSeo() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);
  const metadata = getRouteMetadata(pathname);
  const canonicalUrl = pathname === '/' ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
  const robots = metadata.index === false
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  const ogType = metadata.type === 'article' ? 'article' : 'website';
  const image = metadata.image || DEFAULT_OG_IMAGE;
  const imageAlt = metadata.imageAlt || DEFAULT_OG_IMAGE_ALT;

  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={metadata.ogTitle || metadata.title} />
      <meta property="og:description" content={metadata.ogDescription || metadata.description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.twitterTitle || metadata.ogTitle || metadata.title} />
      <meta name="twitter:description" content={metadata.twitterDescription || metadata.ogDescription || metadata.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {metadata.type === 'article' && metadata.publishedTime && (
        <meta property="article:published_time" content={metadata.publishedTime} />
      )}
      {metadata.type === 'article' && metadata.modifiedTime && (
        <meta property="article:modified_time" content={metadata.modifiedTime} />
      )}
      {metadata.type === 'article' && metadata.section && (
        <meta property="article:section" content={metadata.section} />
      )}
      {metadata.type === 'article' && (
        <meta property="article:author" content={SITE_NAME} />
      )}
      {metadata.type === 'article' && metadata.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {metadata.scripts?.map((schema, index) => (
        <script key={`${pathname}-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}

export default RouteSeo;
