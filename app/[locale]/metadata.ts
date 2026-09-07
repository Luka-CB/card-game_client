import type { Metadata } from "next";

const locales = ["en", "ka", "ru"] as const;

export function localizedMetadata(
  locale: string,
  path: string,
  metadata: Metadata,
): Metadata {
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries(
        locales.map((supportedLocale) => [
          supportedLocale,
          `/${supportedLocale}${path}`,
        ]),
      ),
    },
  };
}
