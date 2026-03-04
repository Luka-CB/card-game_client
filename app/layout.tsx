import type { Metadata } from "next";
import ClientLayout from "./clientLayout";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joker Clash",
  description: "Joker Card Game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={roboto.className}>
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}
