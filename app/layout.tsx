import type { Metadata } from "next";
import ClientLayout from "./clientLayout";
import { Roboto } from "next/font/google";
import "@/styles/globals.scss";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joker Clash",
  description: "Joker Card Game",
  icons: {
    icon: "/logo-icon.ico",
    shortcut: "/logo-icon.ico",
    apple: "/logo-icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
