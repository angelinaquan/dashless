import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dashless-delivery.angelinaquan2024.chatgpt.site'),
  title: 'DashLess — Delivery with a twist',
  description: 'A playful food delivery experience that celebrates what you save.',
  openGraph: {
    title: 'DashLess — Delivery with a twist',
    description: 'Order your favorites, track the ride, and celebrate the calories and money you save.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'DashLess — Delivery with a twist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DashLess — Delivery with a twist',
    description: 'Order your favorites, track the ride, and celebrate the calories and money you save.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
