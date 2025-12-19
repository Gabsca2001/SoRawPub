import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

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
        url: '/logo-png.png', // <--- Il nome del file che hai messo in /public
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
    images: ['/logo-png.png'], // <--- Stessa immagine
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
        {/* --- 1. CONFIGURAZIONE IUBENDA (Con i tuoi ID corretti) --- */}
        <Script id="iubenda-cs-config" strategy="beforeInteractive">
          {`
            var _iub = _iub || [];
            _iub.csConfiguration = {
              "lang": "it",
              "siteId": 4360918,        /* <--- IL TUO SITE ID */
              "cookiePolicyId": 96160872, /* <--- IL TUO POLICY ID */
              "banner": { 
                "position": "float-bottom-center", 
                "acceptButtonDisplay": true, 
                "customizeButtonDisplay": true, 
                "rejectButtonDisplay": true 
              }
            };
          `}
        </Script>

        {/* --- 2. CARICAMENTO SCRIPT BANNER --- */}
        <Script 
          src="//cdn.iubenda.com/cs/iubenda_cs.js" 
          strategy="afterInteractive" 
        />
      </head>
      
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}