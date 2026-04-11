import Link from "next/link";
import styles from "./page.module.scss";

const values = [
  {
    title: "Fair Play First",
    text: "Every round is designed around clear rules, balanced gameplay, and transparent scoring.",
  },
  {
    title: "Fast, Smooth Matches",
    text: "From room creation to final score, we focus on responsive and low-friction gameplay.",
  },
  {
    title: "Community Driven",
    text: "Joker is built around players. Feedback directly shapes features, balancing, and quality-of-life updates.",
  },
];

const features = [
  "Real-time multiplayer card matches",
  "Classic trick-taking mechanics with Joker twists",
  "Live scoreboards and round history",
  "Responsive experience for desktop and mobile",
  "Sound, animations, and in-game UI controls",
];

export default function AboutPage() {
  return (
    <main className={styles.about}>
      <section className={styles.hero}>
        <p className={styles.badge}>About Joker</p>
        <h1>
          Built for players who love strategy, speed, and card game mastery.
        </h1>
        <p>
          Joker is an online multiplayer card experience where every hand
          matters. We combine classic card table energy with modern real-time
          gameplay.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Who We Are</h2>
        <p>
          We are a small team focused on delivering a polished and competitive
          card game platform. Our goal is simple: make every match fair,
          engaging, and fun to replay.
        </p>
      </section>

      <section className={styles.section}>
        <h2>What Makes Joker Different</h2>
        <ul className={styles.list}>
          {features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Our Values</h2>
        <div className={styles.grid}>
          {values.map((value) => (
            <article key={value.title} className={styles.card}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Trust & Transparency</h2>
        <p>
          We are committed to clear policies and player safety. You can review
          our platform details at any time.
        </p>
        <div className={styles.links}>
          <Link href="/rules">Game Rules</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/data-deletion">Data Deletion</Link>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Play?</h2>
        <p>Join a room, challenge friends, and climb with smart play.</p>
        <Link href="/rooms" className={styles.ctaBtn}>
          Start Playing
        </Link>
      </section>
    </main>
  );
}
