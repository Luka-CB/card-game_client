import useSocket from "@/hooks/useSocket";
import styles from "./BidModal.module.scss";
import { motion } from "framer-motion";
import { HandBid, PlayingCard, RoomUser, ScoreBoard } from "@/utils/interfaces";
import { useEffect, useState, useRef } from "react";
import CountDownClock from "../../gameBoard/timer/CountDownClock";
import { calculateBotBid } from "@/utils/gameRoom";

interface BidModalProps {
  rotatedPlayers: RoomUser[];
  data: {
    currentHand: number;
    handCount: number;
    roomId: string;
    currentPlayerId: string;
    dealerId: string;
    players: string[];
    handBids: HandBid[] | null;
    roomUsers: RoomUser[];
    hands: { hand: PlayingCard[]; playerId: string }[] | null;
    trumpCard: PlayingCard | null;
  };
}

const BidModal = ({ data, rotatedPlayers }: BidModalProps) => {
  const [choosingBid, setChoosingBid] = useState(false);

  const socket = useSocket();

  const botTimeout1Ref = useRef<NodeJS.Timeout | null>(null);
  const botTimeout2Ref = useRef<NodeJS.Timeout | null>(null);

  const bids =
    data.handBids
      ?.map((bid) =>
        bid.bids?.map((b) => (data.handCount === b.handNumber ? b.bid : null))
      )
      .flat()
      .filter((s) => s !== undefined) || [];

  const bidSum = bids.reduce((acc: any, bid) => acc + (bid as number), 0);

  const playerIndex = rotatedPlayers?.findIndex(
    (p) => p.id === data.currentPlayerId
  );
  const nextPlayerId =
    rotatedPlayers[(playerIndex + 1) % rotatedPlayers.length].id;

  const handleBidClick = (bid: number) => {
    if (!socket) return;

    if (botTimeout1Ref.current) clearTimeout(botTimeout1Ref.current);
    if (botTimeout2Ref.current) clearTimeout(botTimeout2Ref.current);

    setChoosingBid(true);

    socket.emit("updateBids", data.roomId, {
      playerId: data.currentPlayerId,
      gameHand: data.currentHand,
      bid,
    });

    setTimeout(() => {
      socket.emit("updateGameInfo", data.roomId, {
        currentPlayerId: nextPlayerId,
        status: data.dealerId === data.currentPlayerId ? "playing" : "bid",
      });
      setChoosingBid(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (botTimeout1Ref.current) clearTimeout(botTimeout1Ref.current);
      if (botTimeout2Ref.current) clearTimeout(botTimeout2Ref.current);
    };
  }, []);

  const onComplete = () => {
    if (!socket) return;

    if (botTimeout1Ref.current || botTimeout2Ref.current) {
      return;
    }

    setChoosingBid(true);

    const playerOrder = rotatedPlayers.map((p) => p.id);

    const currentBids: { [playerId: string]: number } =
      Object.fromEntries(
        data?.handBids
          ?.filter((bid) => bid.playerId !== data.currentPlayerId)
          ?.map((bid) => {
            const currentHandScore = bid.bids.find(
              (b) => b.handNumber === data.handCount
            );
            return [bid.playerId, currentHandScore?.bid || 0];
          }) || []
      ) || {};

    botTimeout1Ref.current = setTimeout(() => {
      socket.emit("setBotBid", {
        roomId: data.roomId,
        playerId: data.currentPlayerId,
        hand:
          data.hands?.find((h) => h.playerId === data.currentPlayerId)?.hand ||
          [],
        playerOrder,
        currentBids,
        nextPlayerId,
      });

      setChoosingBid(false);
      botTimeout1Ref.current = null;
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { duration: 0.2 },
      }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className={styles.modal_bg}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4 },
        }}
        exit={{ opacity: 0, y: 100, transition: { duration: 0.4 } }}
        className={styles.modal}
      >
        <div className={styles.count_down}>
          <CountDownClock
            onComplete={onComplete}
            textColor="black"
            duration={15}
          />
        </div>
        <h4>Choose a Bid</h4>
        <div className={styles.bids}>
          {Array.from({ length: data.currentHand + 1 }).map((_, index) => (
            <button
              key={index}
              className={styles.bid_btn}
              onClick={() => handleBidClick(index)}
              disabled={
                choosingBid ||
                (data.currentPlayerId === data.dealerId &&
                  bidSum + index === data.currentHand)
              }
            >
              {index === 0 ? "-" : index}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BidModal;
