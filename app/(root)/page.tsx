import Header from "@/components/header/Header";
import styles from "./page.module.scss";
import Banner from "@/components/home/Banner";
import Image from "next/image";
import { FaInfo } from "react-icons/fa6";
import Auth from "@/components/auth/Auth";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.container}>
      <Banner />
      <div className={styles.cards}>
        <Link href="/classic">
          <div className={styles.card}>
            <Image src="/jok.png" alt="joker" width={220} height={220} />
            <h3>Classic Game</h3>
            <button className={styles.info_btn} title="Found out more">
              <FaInfo />
            </button>
          </div>
        </Link>
        <Link href="/nines">
          <div className={styles.card}>
            <Image src="/jok2.png" alt="joker" width={220} height={220} />
            <h3>Only Nines Game</h3>
            <button className={styles.info_btn} title="Found out more">
              <FaInfo />
            </button>
          </div>
        </Link>
        <Link href="/betting">
          <div className={`${styles.card} ${styles.card_fill}`}>
            <Image
              src="/jok-bet.webp"
              alt="joker"
              fill
              className={styles.image}
            />
            <h3>Betting Game</h3>

            <button className={styles.info_btn} title="Found out more">
              <FaInfo />
            </button>
          </div>
        </Link>
      </div>
      <Auth />
    </main>
  );
}
