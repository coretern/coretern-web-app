import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
    display: 'swap',
    weight: ['400', '600', '700', '800', '900'],
});

export const metadata = {
    title: 'CoreTern | Launch Your Tech Career',
    description: 'Premium tech internships and B2B software solutions. Build your career with hands-on experience in Web Development, Mobile Apps, and Cloud Computing.',
    metadataBase: new URL('https://coretern.com'),
    openGraph: {
        title: 'CoreTern | Launch Your Tech Career',
        description: 'Premium tech internships and B2B software solutions.',
        url: 'https://coretern.com',
        siteName: 'CoreTern',
        images: [{ url: '/coretern_logo.png', width: 800, height: 600 }],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'CoreTern | Launch Your Tech Career',
        description: 'Premium tech internships and B2B software solutions.',
        images: ['/coretern_logo.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
            <body className="font-[family-name:var(--font-inter)] antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
