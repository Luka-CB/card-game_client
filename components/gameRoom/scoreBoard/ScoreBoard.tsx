import styles from "./ScoreBoard.module.scss";
import { HandWin, RoomUser, Round, ScoreBoard } from "@/utils/interfaces";
import { substringText } from "@/utils/misc";
import { motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";

interface ScoreBoardProps {
  roomId: string;
  hisht: string;
  scoreBoard: ScoreBoard[] | null;
  roomUsers: RoomUser[] | null;
  closeModal?: () => void;
}

const ScoreBoardModal: React.FC<ScoreBoardProps> = ({
  scoreBoard,
  roomUsers,
  closeModal,
  hisht,
}) => {
  const windowSize = useWindowSize();

  const getPlayerName = (playerId: string) => {
    const user = roomUsers?.find((user) => user.id === playerId);
    return user?.username || "Unknown Player";
  };

  return (
    <div className={styles.bg} onClick={closeModal}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.board}>
          {scoreBoard?.map((score) => (
            <div key={score.playerId} className={styles.player}>
              {windowSize.height <= 900 ? (
                <section className={styles.player_name_fixed}>
                  <div
                    className={styles.name}
                    title={
                      getPlayerName(score.playerId).length > 10
                        ? getPlayerName(score.playerId)
                        : ""
                    }
                  >
                    {substringText(getPlayerName(score.playerId), 10)}
                  </div>
                </section>
              ) : (
                <section
                  className={styles.player_name}
                  title={
                    getPlayerName(score.playerId).length > 10
                      ? getPlayerName(score.playerId)
                      : ""
                  }
                >
                  {substringText(getPlayerName(score.playerId), 10)}
                </section>
              )}
              <section className={styles.round}>
                {score.roundOne?.map((round) => (
                  <RoundContent key={round.id} round={round} hisht={hisht} />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumOne || 0} />
              <section className={styles.round}>
                {score.roundTwo?.map((round) => (
                  <RoundContent key={round.id} round={round} hisht={hisht} />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumTwo || 0} />
              <section className={styles.round}>
                {score.roundThree?.map((round) => (
                  <RoundContent key={round.id} round={round} hisht={hisht} />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumThree || 0} />
              <section className={styles.round}>
                {score.roundFour?.map((round) => (
                  <RoundContent key={round.id} round={round} hisht={hisht} />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumFour || 0} />
              <section className={styles.total}>
                <span>{score.totalSum || "-"}</span>
              </section>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const RoundContent = ({ round, hisht }: { round: Round; hisht: string }) => {
  const pointsClass = () => {
    if (round.win === round.bid) {
      return styles.points_won;
    }
    return styles.points;
  };

  const point = () => {
    if (round.points.isBonus) {
      return (
        <div className={styles.bonus}>
          <span>{round.points.value}</span>
          <b>x</b>
          <small>2</small>
        </div>
      );
    } else if (round.points.isCut) {
      return <span className={styles.cut}>{round.points.value}</span>;
    } else {
      return <span>{round.points.value}</span>;
    }
  };

  return (
    <div className={styles.round_content}>
      <span className={styles.game_hand}>{round.gameHand}.</span>
      <span className={styles.bid}>{round.bid || "-"}</span>
      <div className={pointsClass()}>
        {round.points.value > 0 ? (
          point()
        ) : round.points.value < 0 ? (
          <div className={styles.hisht}>
            <div className={styles.line_one}></div>
            <div className={styles.line_two}></div>
            <div className={styles.line_three}></div>
            <small>-{hisht}</small>
          </div>
        ) : (
          "-"
        )}
      </div>
    </div>
  );
};

const RoundSum = ({ roundSum }: { roundSum: number }) => {
  return (
    <section className={styles.round_sum}>
      <span>{roundSum || "-"}</span>
    </section>
  );
};

export default ScoreBoardModal;
