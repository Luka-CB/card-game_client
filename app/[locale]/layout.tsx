import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import ClientLayout from "../clientLayout";

const locales = ["en", "ka", "ru"] as const;
type Locale = (typeof locales)[number];

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

async function getMessages(locale: Locale) {
  return (await import(`../../messages/${locale}.json`)).default;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);
  const metadata = messages?.Metadata ?? {};

  return {
    title: metadata.title || "Joker Clash",
    description: metadata.description || "Joker Card Game",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ka: "/ka",
        ru: "/ru",
      },
    },
    openGraph: {
      title: metadata.title || "Joker Clash",
      description: metadata.description || "Joker Card Game",
      locale,
      siteName: "Joker Clash",
      type: "website",
      images: [
        {
          url: "/banner-img.jpg",
          width: 1200,
          height: 630,
          alt: "Joker Clash – Online Card Game",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title || "Joker Clash",
      description: metadata.description || "Joker Card Game",
      images: ["/banner-img.jpg"],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientLayout>{children}</ClientLayout>
    </NextIntlClientProvider>
  );
}
