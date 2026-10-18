import type { Metadata } from "next";
import styles from "./page.module.scss";
import Banner from "@/components/home/Banner";
import Auth from "@/components/auth/Auth";
import DisplayRoomCards from "@/components/home/displayCards/DisplayRoomCards";
import { localizedMetadata } from "../metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return localizedMetadata(locale, "", {
    title: "Joker Clash",
    description: "Joker Card Game",
  });
}

export default function Home() {
  return (
    <main className={styles.container}>
      <Banner />
      <DisplayRoomCards />
      <Auth />
    </main>
  );
}
