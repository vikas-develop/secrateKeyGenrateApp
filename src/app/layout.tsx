import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://secratekeygenrate.vercel.app/'),
  title: {
    default: "Secret Key Generator - Generate Secure Passwords, API Keys & Cryptographically Secure Secrets",
    template: "%s | Secret Key Generator"
  },
  description: "Generate cryptographically secure secret keys, passwords, API keys, and UUIDs using 10+ algorithms. Free online tool with password strength meter, QR codes, export options, and local storage. No data sent to servers.",
  keywords: [
    "secret key generator",
    "password generator",
    "API key generator",
    "UUID generator",
    "secure password",
    "cryptographic random",
    "secret generator",
    "password strength",
    "QR code generator",
    "secure secrets",
    "random key generator",
    "hexadecimal generator",
    "base64 generator",
    "PIN generator",
    "binary key generator"
  ],
  authors: [{ name: "Secret Key Generator" }],
  creator: "Secret Key Generator",
  publisher: "Secret Key Generator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Secret Key Generator",
    title: "Secret Key Generator - Generate Secure Passwords & API Keys",
    description: "Generate cryptographically secure secret keys, passwords, API keys, and UUIDs using 10+ algorithms. Free, secure, and privacy-focused.",
    images: [
      {
        url: "/og-image.png", // You should add an OG image
        width: 1200,
        height: 630,
        alt: "Secret Key Generator - Secure Password & API Key Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Key Generator - Generate Secure Passwords & API Keys",
    description: "Generate cryptographically secure secret keys, passwords, API keys, and UUIDs using 10+ algorithms. Free, secure, and privacy-focused.",
    images: ["/og-image.png"],
    creator: "@secretkeygen", // Replace with your Twitter handle if you have one
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "security",
  classification: "Security Tool",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://secratekeygenrate.vercel.app/';
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Secret Key Generator",
    "description": "Generate cryptographically secure secret keys, passwords, API keys, and UUIDs using 10+ algorithms",
    "url": siteUrl,
    "applicationCategory": "SecurityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    },
    "featureList": [
      "10+ cryptographic algorithms",
      "Password strength meter",
      "QR code generation",
      "Batch generation",
      "Export to TXT/JSON",
      "Local storage",
      "Custom character sets",
      "Dark mode support"
    ],
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "releaseNotes": "Initial release with comprehensive secret generation capabilities",
    "screenshot": `${siteUrl}/og-image.png`,
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Organization",
      "name": "Secret Key Generator"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

