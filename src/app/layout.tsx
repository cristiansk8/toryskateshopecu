import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

<meta name="robots" content="noindex, nofollow" data-whatsapp-url="true" />

export const metadata: Metadata = {
  metadataBase: new URL('https://toryskateshopecu.com'),
  title: {
    default: 'Tory Skateshop Ecuador | Skate, Streetwear y Accesorios',
    template: '%s | Tory Skateshop Ecuador'
  },
  description: 'Tory Skateshop Ecuador - Tu tienda de skate en Ecuador. Encuentra tablas, zapatillas, ropa streetwear y accesorios para skateboarding. Envíos a todo Ecuador.',
  keywords: ['tory skateshop', 'skateshop ecuador', 'skate ecuador', 'tablas skate ecuador', 'zapatillas skate', 'streetwear ecuador', 'skateboarding ecuador', 'tory skate', 'skate shop', 'accesorios skate'],
  icons: {
    icon: '/logo-tory-ecu.jpg',
    shortcut: '/logo-tory-ecu.jpg',
    apple: '/logo-tory-ecu.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: 'https://toryskateshopecu.com',
    siteName: 'Tory Skateshop Ecuador',
    images: [{
      url: '/logo-tory-ecu.jpg',
      width: 1200,
      height: 630,
      alt: 'Tory Skateshop Ecuador - Skate y Streetwear'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@toryskateshopecu'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large'
    }
  }
}
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
