import styles from "./ScoreBoard.module.scss";
import { RoomUser, Round, ScoreBoard } from "@/utils/interfaces";
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

const normalizeScore = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
};

const ScoreBoardModal: React.FC<ScoreBoardProps> = ({
  scoreBoard,
  roomUsers,
  closeModal,
  hisht,
}) => {
  const windowSize = useWindowSize();

  const getPlayerName = (playerId: string) => {
    const user = roomUsers?.find((user) => user?.id === playerId);
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
          {scoreBoard?.map((score, playerIndex) => (
            <div key={score.playerId || playerIndex} className={styles.player}>
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
                {score.roundOne?.map((round, i) => (
                  <RoundContent
                    key={round?.id ?? `rl-${i}`}
                    round={round}
                    hisht={hisht}
                  />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumOne || 0} />
              <section className={styles.round}>
                {score.roundTwo?.map((round, i) => (
                  <RoundContent
                    key={round?.id ?? `r2-${i}`}
                    round={round}
                    hisht={hisht}
                  />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumTwo || 0} />
              <section className={styles.round}>
                {score.roundThree?.map((round, i) => (
                  <RoundContent
                    key={round?.id ?? `r3-${i}`}
                    round={round}
                    hisht={hisht}
                  />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumThree || 0} />
              <section className={styles.round}>
                {score.roundFour?.map((round, i) => (
                  <RoundContent
                    key={round?.id ?? `r4-${i}`}
                    round={round}
                    hisht={hisht}
                  />
                ))}
              </section>
              <RoundSum roundSum={score.roundSumFour || 0} />
              <section className={styles.total}>
                <span>{normalizeScore(score.totalSum || 0) || "-"}</span>
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
    if (round?.win === round?.bid) {
      return styles.points_won;
    }
    return styles.points;
  };

  const point = () => {
    if (round.points?.isBonus) {
      return (
        <div className={styles.bonus}>
          <span>{round.points?.value}</span>
          <b>x</b>
          <small>2</small>
        </div>
      );
    } else if (round.points.isCut) {
      return <span className={styles.cut}>{round.points?.value}</span>;
    } else {
      return <span>{round.points?.value}</span>;
    }
  };

  return (
    <div className={styles.round_content}>
      <span className={styles.game_hand}>{round?.gameHand}.</span>
      <span className={styles.bid}>{round?.bid || "-"}</span>
      <div className={pointsClass()}>
        {round?.points?.value > 0 ? (
          point()
        ) : round?.points?.value < 0 ? (
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
  const normalizedRoundSum = normalizeScore(roundSum || 0);

  return (
    <section className={styles.round_sum}>
      <span>{normalizedRoundSum || "-"}</span>
    </section>
  );
};

export default ScoreBoardModal;
