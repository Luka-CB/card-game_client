import GamePageHeader from "@/components/gamePage/GamePageHeader";
import styles from "./page.module.scss";
import CreateRoom from "@/components/gamePage/CreateRoom";
import Cards from "@/components/gamePage/cards/Cards";

export default function Classic() {
  return (
    <main className={styles.container}>
      <GamePageHeader type="classic" />
      <Cards />

      <CreateRoom />
    </main>
  );
}
