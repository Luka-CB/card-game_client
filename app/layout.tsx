import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.scss";
import { cookies } from "next/headers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

const locales = ["en", "ka", "ru"] as const;
type Locale = (typeof locales)[number];

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Joker Clash",
    template: "%s | Joker Clash",
  },
  description: "Joker Card Game",
  icons: {
    icon: "/logo-icon.ico",
    shortcut: "/logo-icon.ico",
    apple: "/logo-icon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const lang: Locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : "en";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Joker Clash",
    description: "Play Joker card game online with friends in real-time.",
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://jokerclash.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
