import Header from "@/app/components/home/Header";
import styles from "./page.module.scss";
import Banner from "@/app/components/home/Banner";
import Image from "next/image";
import { FaInfo } from "react-icons/fa6";

export default function Home() {
  return (
    <main className={styles.container}>
      <Header />
      <Banner />
      <div className={styles.cards}>
        <div className={styles.card}>
          <Image src="/jok.png" alt="joker" width={220} height={220} />
          <h3>Classic Game</h3>
          <button className={styles.info_btn} title="Found out more">
            <FaInfo />
          </button>
        </div>
        <div className={styles.card}>
          <Image src="/jok2.png" alt="joker" width={220} height={220} />
          <h3>Only Nines Game</h3>
          <button className={styles.info_btn} title="Found out more">
            <FaInfo />
          </button>
        </div>
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
      </div>
    </main>
  );
}
