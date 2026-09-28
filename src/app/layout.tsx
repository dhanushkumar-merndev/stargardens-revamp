import type { Metadata, Viewport } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';
import SiteChrome from '@/components/site/SiteChrome';
import SiteFooter from '@/components/site/SiteFooter';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap'
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: 'Star Gardens · Landscape Design & Development Studio',
    template: '%s · Star Gardens'
  },
  description:
    'Star Gardens & Development designs, builds and maintains gardens for villas, apartments, offices, resorts and managed farmland. Corporate and event plant rental, AMC, workshops and CSR drives.'
};

export const viewport: Viewport = {
  themeColor: '#1E140D',
  viewportFit: 'cover'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <SiteChrome />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
