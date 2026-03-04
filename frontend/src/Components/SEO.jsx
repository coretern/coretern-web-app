import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, type = 'website', url = '', image = '' }) => {
    const siteTitle = 'CoreTern | Launch Your Tech Career';
    const defaultDescription = 'Premium tech internships and B2B software solutions. Build your career with hands-on experience in Web Development, Mobile Apps, and Cloud Computing.';
    const defaultImage = 'https://yourdomain.com/og-image.jpg'; // Recommended to add a real preview image link here later

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title ? `${title} | CoreTern` : siteTitle}</title>
            <meta name="title" content={title ? `${title} | CoreTern` : siteTitle} />
            <meta name="description" content={description || defaultDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={`https://yourdomain.com${url}`} />
            <meta property="og:title" content={title ? `${title} | CoreTern` : siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={`https://yourdomain.com${url}`} />
            <meta property="twitter:title" content={title ? `${title} | CoreTern` : siteTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
            <meta property="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default SEO;
