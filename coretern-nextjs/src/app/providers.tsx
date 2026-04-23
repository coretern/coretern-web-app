'use client';

import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }) {
    return (
        <ThemeProvider>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                <Toaster
                    position="bottom-center"
                    containerStyle={{ zIndex: 999999 }}
                />
                {children}
            </GoogleOAuthProvider>
        </ThemeProvider>
    );
}
