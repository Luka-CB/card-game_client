import GamePageHeader from "@/components/gamePage/GamePageHeader";
import styles from "./page.module.scss";
import CreateRoom from "@/components/gamePage/CreateRoom";

export default function Betting() {
  return (
    <main className={styles.container}>
      <GamePageHeader type="betting" />

      <CreateRoom />
    </main>
  );
}
