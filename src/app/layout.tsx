import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://elsalamony.com"),
  title: {
    default: "مطبعة السلاموني | Elsalamony Printing House",
    template: "%s | مطبعة السلاموني"
  },
  description: "مطبعة السلاموني للطباعة والدعاية والإعلان بمدينة السادات والإسكندرية. نقدم خدمات الطباعة الرقمية والأوفست الفاخرة للشركات والمصانع: كروت شخصية وبزنس كارد، لافتات وبانر رول أب، دفاتر حسابات وسجلات تجارية، لوحات السلامة المهنية، وعلب وتغليف المنتجات بأعلى جودة وأسرع تسليم.",
  keywords: [
    "مطبعة السلاموني",
    "مطبعة في السادات",
    "مطبعة في الإسكندرية",
    "طباعة بنر",
    "رول أب بانر",
    "كروت شخصية",
    "بزنس كارد",
    "مطبوعات شركات",
    "دفاتر حسابات",
    "لوحات سلامة وصحة مهنية",
    "علب وتغليف المنتجات",
    "دعاية وإعلان",
    "طباعة أوفست",
    "طباعة رقمية",
    "تعبئة وتغليف مصر"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "مطبعة السلاموني | Elsalamony Printing House",
    description: "شريكك المثالي لخدمات الطباعة الاحترافية بمدينة السادات والإسكندرية. كروت، لافتات، مطبوعات شركات وتغليف بأعلى معايير الجودة.",
    url: "https://elsalamony.com",
    siteName: "مطبعة السلاموني",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 800,
        alt: "شعار مطبعة السلاموني - Elsalamony Printing House",
      }
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "مطبعة السلاموني | Elsalamony Printing House",
    description: "خدمات طباعة رقمية وأوفست احترافية بمدينة السادات والإسكندرية. جودة فائقة وحلول متكاملة للمصانع والشركات.",
    images: ["/logo.jpeg"],
  },
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
