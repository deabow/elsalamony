import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://elsalamony.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "مطبعة السلاموني | تصميم وطباعة كافة المطبوعات والدعاية للإعلان",
    template: "%s | مطبعة السلاموني للمطبوعات"
  },
  description: "مطبعة السلاموني — أفضل مطبعة لتنفيذ كافة المطبوعات التجارية والدعاية والإعلان بمدينة السادات والإسكندرية. طباعة كروت شخصية وبزنس كارد، لافتات وبانر رول أب، دفاتر فواتير وسجلات، لوحات سلامة، وملصقات وتغليف المنتجات بأعلى جودة وأفضل سعر.",
  keywords: [
    "المطبوعات",
    "مطبعة مطبوعات",
    "خدمات المطبوعات",
    "مطبعة السلاموني",
    "مطبعة في السادات",
    "مطبعة في الإسكندرية",
    "طباعة كروت شخصية",
    "بزنس كارد فاخر",
    "طباعة بنر ورول أب",
    "رول أب بانر السادات",
    "دفاتر وسجلات فواتير",
    "لوحات سلامة وصحة مهنية",
    "طباعة استيكرات وملصقات",
    "طباعة علب وتغليف",
    "طباعة أوفست وديجيتال",
    "دعاية وإعلان مصر",
    "حاسبة أسعار المطبوعات",
    "أفضل مطبعة في السادات"
  ],
  alternates: {
    canonical: siteUrl,
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
  openGraph: {
    title: "مطبعة السلاموني | جميع خدمات المطبوعات والدعاية والإعلان",
    description: "شريكك الأول لتنفيذ كافة المطبوعات التجارية والدعاية بمدينة السادات والإسكندرية. أسعار آية وشفافة وتسليم سريع للجودة الأرقى.",
    url: siteUrl,
    siteName: "مطبعة السلاموني للمطبوعات",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "شعار مطبعة السلاموني للمطبوعات والدعاية والإعلان",
      }
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مطبعة السلاموني | تصميم وطباعة المطبوعات والدعاية",
    description: "أرقى خدمات المطبوعات الرقمية والأوفست بمدينة السادات والإسكندرية. كروت، لافتات، دفاتر، ولوحات سلامة.",
    images: ["/logo.jpeg"],
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "PrintShop",
  "name": "مطبعة السلاموني للمطبوعات والدعاية والإعلان",
  "alternateName": "Elsalamony Printing House",
  "url": siteUrl,
  "logo": `${siteUrl}/logo.jpeg`,
  "image": `${siteUrl}/logo.jpeg`,
  "description": "أفضل مطبعة لتنفيذ كافة المطبوعات التجارية والدعاية والإعلان بمدينة السادات والإسكندرية: طباعة كروت شخصية وبزنس كارد، بانر ورول أب، دفاتر وسجلات فواتير، لوحات السلامة، وتغليف المنتجات.",
  "telephone": "+201000000000",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "مدينة السادات والإسكندرية",
    "addressCountry": "EG"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "30.3847",
    "longitude": "30.5283"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
    "opens": "09:00",
    "closes": "21:00"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "كتالوج خدمات المطبوعات",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "طباعة الكروت الشخصية والبزنس كارد" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "طباعة بانر ورول أب الفعاليات والمعارض" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "طباعة دفاتر الفواتير والسجلات التجارية" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "طباعة لوحات السلامة والصحة المهنية للمصانع" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "طباعة ملصقات وتغليف العبوات" } }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Cairo:wght@300;400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Readex+Pro:wght@200;300;400;500;600;700&family=Tajawal:wght@300;400;500;700;800;900&family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            try {
              var stored = localStorage.getItem('theme');
              if (stored) {
                document.documentElement.setAttribute('data-theme', stored);
              } else {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            } catch (e) {}
          })()
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
