import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://jokerclash.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/en/", "/ka/", "/ru/"],
        disallow: [
          "/en/account",
          "/ka/account",
          "/ru/account",
          "/en/rooms",
          "/ka/rooms",
          "/ru/rooms",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
