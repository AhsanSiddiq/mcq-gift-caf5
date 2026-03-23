import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://thecahub.com";

export const viewport: Viewport = {
  themeColor: "#3DB371",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "The CA Hub",
    template: "%s – The CA Hub",
  },
  description:
    "Free MCQ practice for PRC & CAF, a Big 4-ready CA induction CV builder, and a real CA roadmap — built by ICAP's first-ever 6-paper CFAP Gold Medalist. No paywalls. No fluff.",

  keywords: [
    "ICAP MCQ practice",
    "CA MCQ",
    "PRC MCQs",
    "CAF MCQs",
    "CA induction CV",
    "ICAP scheme 2025",
    "ICAP scheme 2021",
    "chartered accountancy Pakistan",
    "CA Pakistan",
    "ICAP audit internship CV",
    "Big 4 CV Pakistan",
    "CAF-5 management accounting MCQ",
    "ICAP gold medalist",
    "Muhammad Ahsan Siddiq",
    "free CA study resources",
    "ICAP past papers",
    "CFAP strategy",
  ],

  authors: [{ name: "Muhammad Ahsan Siddiq", url: BASE_URL }],
  creator: "Muhammad Ahsan Siddiq",
  publisher: "The CA Hub",

  openGraph: {
    type: "website",
    locale: "en_PK",
    url: BASE_URL,
    siteName: "The CA Hub",
    title: "The CA Hub – Free ICAP MCQ Practice & CA Induction CV Maker",
    description:
      "Free MCQ practice for PRC & CAF, a Big 4-ready CA induction CV builder, and a real CA roadmap — built by ICAP's first-ever 6-paper CFAP Gold Medalist.",
    images: [
      {
        url: "/CAHub.png",
        width: 1200,
        height: 630,
        alt: "The CA Hub – Free tools for ICAP CA students in Pakistan",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "The CA Hub – Free ICAP MCQ Practice & CA Induction CV Maker",
    description:
      "Free MCQ practice for PRC & CAF, a Big 4-ready CV builder, and a real CA roadmap — by ICAP's CFAP Gold Medalist. No paywalls.",
    images: ["/CAHub.png"],
    creator: "@ahsansiddiq",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png",    type: "image/png", sizes: "32x32" },
      { url: "/icon-512.png",type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
  },

  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-N3ENZXNP07" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-N3ENZXNP07');
        `}} />

        {/* Microsoft Clarity */}
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "w022n0zrgb");
        `}} />

        {/* Structured Data – Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "The CA Hub",
              url: BASE_URL,
              logo: `${BASE_URL}/CAHub.png`,
              description:
                "Free ICAP MCQ practice, CA induction CV builder, and CA study roadmap for Pakistani CA students.",
              founder: {
                "@type": "Person",
                name: "Muhammad Ahsan Siddiq",
                jobTitle: "ICAP CFAP Gold Medalist, ACCA Affiliate, CFA Level I",
                url: BASE_URL,
              },
              sameAs: [
                "https://thecahub.com",
              ],
            }),
          }}
        />

        {/* Structured Data – WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "The CA Hub",
              url: BASE_URL,
              description:
                "Free ICAP MCQ practice, CA induction CV builder, and CA roadmap for CA students in Pakistan.",
            }),
          }}
        />
      </head>
      <body
        className={cn(
          inter.variable,
          spaceGrotesk.variable,
          playfair.variable,
          "min-h-screen antialiased flex flex-col overflow-x-hidden"
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
