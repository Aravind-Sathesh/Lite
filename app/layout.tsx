import type { Metadata } from 'next';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
import type React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ColorProvider } from '@/contexts/ColorContext';
import { Toaster } from '@/components/ui/sonner';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lite',
  description: 'BITS Pilani! Its Tragic!',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Lite',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  // themeColor moved to viewport below
  openGraph: {
    title: 'Lite',
    description: 'BITS Pilani! Its Tragic!',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Lite',
    description: 'BITS Pilani! Its Tragic!',
    images: ['/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a84ff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lite" />
        <meta name="theme-color" content="#0a84ff" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`font-sans antialiased bg-neutral-950 overflow-hidden`}>
        <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <ColorProvider>
            {children}
            <Toaster />
          </ColorProvider>
        </div>
      </body>
    </html>
  );
}
