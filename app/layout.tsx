import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ColorProvider } from '@/contexts/ColorContext';
import { Toaster } from '@/components/ui/sonner';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Lite',
  description: 'BITS Pilani! Its Tragic!',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Lite',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a0a0a', // Matches neutral-950
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='bg-neutral-950'>
      <body
        className={`font-sans antialiased bg-neutral-950 min-h-dvh w-full`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          boxSizing: 'border-box',
        }}
      >
        <ColorProvider>
          {children}
          <Toaster />
        </ColorProvider>
      </body>
    </html>
  );
}
