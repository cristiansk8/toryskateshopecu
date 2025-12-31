import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

<meta name="robots" content="noindex, nofollow" data-whatsapp-url="true" />

export const metadata: Metadata = {
  title: {
    default: 'Shop | Calzado y ropa Premium en Colombia',
    template: '%s | Isla 420'
  },
  description: 'Encuentra los sneakers más exclusivos y cómodos. viste premium para hombre y mujer con envíos a todo Colombia.',
  keywords: ['sneakers', 'zapatillas premium', 'calzado deportivo', 'moda urbana', 'Colombia'],
  icons: {
    icon: '/vercel.svg',  // Ruta a tu SVG en la carpeta public
    shortcut: '/vercel.svg',  // Fallback PNG
    apple: '/apple-touch-icon.png',  // Para dispositivos Apple
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: '',
    siteName: 'Ritzi Sneakers',
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'Nomada screenshop - Viste Premium'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@nomada'
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
    <html lang="en">
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
