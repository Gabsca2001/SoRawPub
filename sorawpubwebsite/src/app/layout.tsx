import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

// 1. IMPORTANTE: Importiamo l'AuthProvider
import { AuthProvider } from '@/context/AuthContext'; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sorawcocktailbar.it'),
  title: "SO RAW Cocktail Bar",
  description: "So Raw Pub, pub a Partinico Via Giuseppe Verdi n.12, specializzato in cocktail, birre e cibo di qualità. Vieni a trovarci!",
  openGraph: {
    title: "SO RAW Cocktail Bar",
    description: "So Raw Pub, pub a Partinico. Cocktail, birre e cibo di qualità.",
    url: 'https://www.sorawcocktailbar.it',
    siteName: 'SO RAW',
    images: [
      {
        url: '/logo-png.png',
        width: 1200,
        height: 630,
        alt: 'SO RAW Cocktail Bar - Partinico',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SO RAW Cocktail Bar",
    description: "So Raw Pub, pub a Partinico. Cocktail, birre e cibo di qualità.",
    images: ['/logo-png.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <Script id="iubenda-cs-config" strategy="beforeInteractive">
          {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "lang": "it",
              "siteId": 4360918,
              "cookiePolicyId": 96160872,
              "banner": { 
                "position": "float-bottom-center", 
                "acceptButtonDisplay": true, 
                "customizeButtonDisplay": true, 
                "rejectButtonDisplay": true 
              }
            };
          `}
        </Script>
        <Script 
          src="//cdn.iubenda.com/cs/iubenda_cs.js" 
          strategy="afterInteractive" 
        />
      </head>
      
      <body className={inter.className}>
        {/* 2. IMPORTANTE: Avvolgiamo tutto l'app nel Provider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}