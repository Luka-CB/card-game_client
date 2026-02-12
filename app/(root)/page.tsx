import styles from "./page.module.scss";
import Banner from "@/components/home/Banner";
import Image from "next/image";
import { MdOpenInNew } from "react-icons/md";
import Auth from "@/components/auth/Auth";
import Link from "next/link";
import AvatarGallery from "@/components/auth/LeftPanel/AvatarGallery";

export default function Home() {
  return (
    <main className={styles.container}>
      <Banner />
      <div className={styles.cards}>
        <Link href="/games">
          <div className={styles.card}>
            <Image src="/jok.png" alt="joker" width={220} height={220} />
            <h3>Classic Game</h3>
            <button className={styles.info_btn} title="View All Rooms">
              <MdOpenInNew />
            </button>
          </div>
        </Link>
        <Link href="/games">
          <div className={styles.card}>
            <Image src="/jok2.png" alt="joker" width={220} height={220} />
            <h3>Only Nines Game</h3>
            <button className={styles.info_btn} title="View All Rooms">
              <MdOpenInNew />
            </button>
          </div>
        </Link>
      </div>
      <Auth />

      <AvatarGallery />
    </main>
  );
}
