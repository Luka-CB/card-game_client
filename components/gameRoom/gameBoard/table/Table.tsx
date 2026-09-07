import {
  HandBid,
  GameInfo,
  PlayingCard,
  RoomUser,
  PlayedCard,
} from "@/utils/interfaces";
import styles from "./Table.module.scss";
import BidModal from "../../gameControls/bidModal/BidModal";
import CardDeck from "./cardDeck/CardDeck";
import DrawnCards from "./drawnCards/DrawnCards";
import PlayedCards from "./playedCards/PlayedCards";
import LastPlayedCards from "./lastPlayedCards/LastPlayedCards";
import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import usePlayedCardsStore from "@/store/gamePage/playedCardsStore";
import { Socket } from "socket.io-client";
import { useTranslations } from "next-intl";

interface TableProps {
  gameInfo: GameInfo | null;
  user: { _id: string } | null;
  room: {
    users: RoomUser[];
    hisht: string;
    type: string;
    bet: string | null;
  } | null;
  visibleCards: { [key: string]: PlayingCard[] };
  rotatedPlayers: RoomUser[];
  dealingCards?: Record<string, number>;
  socket?: Socket | null;
  children?: ReactNode;
}

const Table: React.FC<TableProps> = ({
  gameInfo,
  user,
  room,
  visibleCards,
  rotatedPlayers,
  dealingCards,
  socket,
  children,
}) => {
  const t = useTranslations("GameRoom.gameBoard.table");

  const { setRoundWinnerId } = usePlayedCardsStore();

  const { stuffing, tearing } = useMemo(() => {
    let stuffing = null;
    let tearing = null;

    if (!stuffing && !tearing && gameInfo?.status === "playing") {
      const bids = gameInfo?.handBids
        ?.map((hb) =>
          hb.bids.map((b) =>
            b.handNumber === gameInfo?.handCount ? b.bid : null,
          ),
        )
        .flat()
        .filter((s) => s !== null);

      const bidSum =
        bids?.reduce((acc: number, bid) => acc + (bid as number), 0) ?? 0;

      if (gameInfo?.currentHand && bidSum < gameInfo?.currentHand) {
        stuffing = gameInfo?.currentHand - bidSum;
      } else {
        tearing = gameInfo?.currentHand && bidSum - gameInfo?.currentHand;
      }
    }

    return { stuffing, tearing };
  }, [
    gameInfo?.status,
    gameInfo?.handBids,
    gameInfo?.currentHand,
    gameInfo?.handCount,
  ]);

  const handleRoundWinner = useCallback(
    (winnerCard: PlayedCard) => {
      if (winnerCard) {
        setRoundWinnerId(winnerCard.playerId);
      }
    },
    [setRoundWinnerId],
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("roundWinner", handleRoundWinner);

    return () => {
      socket.off("roundWinner", handleRoundWinner);
    };
  }, [socket, handleRoundWinner]);

  const bidModalData = useMemo(
    () => ({
      currentHand: gameInfo?.currentHand as number,
      handCount: gameInfo?.handCount as number,
      roomId: gameInfo?.roomId as string,
      currentPlayerId: gameInfo?.currentPlayerId as string,
      dealerId: gameInfo?.dealerId as string,
      handBids: gameInfo?.handBids as HandBid[] | null,
      rotatedPlayers: rotatedPlayers as RoomUser[],
    }),
    [gameInfo, rotatedPlayers],
  );

  return (
    <div className={styles.table}>
      <div className={styles.hand_info}>
        <span>
          {t("handInfo.distribution")} {gameInfo?.currentHand}
        </span>
        {stuffing && (
          <span>
            {t("handInfo.stuffing")} {stuffing}
          </span>
        )}
        {tearing && (
          <span>
            {t("handInfo.tearing")} {tearing}
          </span>
        )}
      </div>
      {gameInfo &&
        gameInfo?.status === "bid" &&
        gameInfo?.currentPlayerId === user?._id && (
          <BidModal data={bidModalData} />
        )}
      <span className={styles.hisht}>
        {t("hisht")} {room?.hisht}
      </span>
      {room?.bet && (
        <span className={styles.bet}>
          {t("bet")} {room?.bet}
        </span>
      )}
      <div className={styles.table_surface}>
        <PlayedCards
          playedCards={gameInfo?.playedCards || []}
          currentPlayerId={gameInfo?.currentPlayerId as string}
          rotatedPlayers={rotatedPlayers}
        />
        {gameInfo?.lastPlayedCards && (
          <LastPlayedCards
            lastPlayedCards={gameInfo?.lastPlayedCards as PlayedCard[]}
            rotatedPlayers={rotatedPlayers}
          />
        )}
        <CardDeck gameInfo={gameInfo} />
        {rotatedPlayers.map((player, index) => (
          <DrawnCards
            key={player.id}
            drawnCards={visibleCards[player.id] || []}
            playerPositionIndex={index}
            playerId={player.id}
            dealingCards={dealingCards || {}}
            gameInfo={{
              dealerId: gameInfo?.dealerId as string | null,
              status: gameInfo?.status as string,
              currentPlayerId: gameInfo?.currentPlayerId as string,
              currentHand: gameInfo?.currentHand as number | null,
              trumpCard: gameInfo?.trumpCard || null,
            }}
          />
        ))}
        <div className={styles.game_info}>
          <span className={styles.game_type}>{room?.type}</span>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Table;
