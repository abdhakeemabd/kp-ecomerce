import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, keywords, ogImage, ogUrl }) => {
  const siteName = 'eacyclic';
  const fullTitle = `${title} | ${siteName} - Easy Shopping Nearby`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl || window.location.href} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || '/logo.png'} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={ogUrl || window.location.href} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage || '/logo.png'} />
    </Helmet>
  );
};

export default SEO;
