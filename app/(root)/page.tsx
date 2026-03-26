import styles from "./page.module.scss";
import Banner from "@/components/home/Banner";
import Auth from "@/components/auth/Auth";
import DisplayRoomCards from "@/components/home/displayCards/DisplayRoomCards";

export default function Home() {
  return (
    <main className={styles.container}>
      <Banner />
      <DisplayRoomCards />
      <Auth />
    </main>
  );
}
