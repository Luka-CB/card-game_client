import GamePageHeader from "@/components/gamePage/GamePageHeader";
import styles from "./page.module.scss";
import Test from "@/components/Test";
import CreateRoom from "@/components/gamePage/CreateRoom";

export default function Nines() {
  return (
    <main className={styles.container}>
      <GamePageHeader type="nines" />
      <Test />

      <CreateRoom />
    </main>
  );
}
