import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, type = 'website', url = '', image = '', noindex = false }) => {
    const siteTitle = 'CoreTern | Launch Your Tech Career';
    const defaultDescription = 'Premium tech internships and B2B software solutions. Build your career with hands-on experience in Web Development, Mobile Apps, and Cloud Computing.';
    const siteUrl = 'https://coretern.com';
    const defaultImage = `${siteUrl}/coretern_logo.png`;

    const seoTitle = title ? `${title} | CoreTern` : siteTitle;
    const seoDescription = description || defaultDescription;
    const seoUrl = `${siteUrl}${url}`;
    const seoImage = image || defaultImage;

    // JSON-LD Structured Data
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": title || "Current Page",
                "item": seoUrl
            }
        ]
    };

    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CoreTern",
        "url": siteUrl,
        "logo": `${siteUrl}/coretern_logo.png`,
        "sameAs": [
            "https://www.linkedin.com/company/coretern",
            "https://twitter.com/coretern",
            "https://www.instagram.com/coretern"
        ]
    };

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="title" content={seoTitle} />
            <meta name="description" content={seoDescription} />
            <link rel="canonical" href={seoUrl} />

            {/* Robots */}
            {noindex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={seoUrl} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={seoUrl} />
            <meta property="twitter:title" content={seoTitle} />
            <meta property="twitter:description" content={seoDescription} />
            <meta property="twitter:image" content={seoImage} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(organizationData)}
            </script>
        </Helmet>
    );
};

export default SEO;
