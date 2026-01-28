import useSocket from "@/hooks/useSocket";
import styles from "./BidModal.module.scss";
import { motion } from "framer-motion";
import { HandBid, RoomUser } from "@/utils/interfaces";
import { useState } from "react";

interface BidModalProps {
  data: {
    currentHand: number;
    handCount: number;
    roomId: string;
    currentPlayerId: string;
    dealerId: string;
    handBids: HandBid[] | null;
    rotatedPlayers: RoomUser[];
  };
}

const BidModal: React.FC<BidModalProps> = ({ data }) => {
  const [choosingBid, setChoosingBid] = useState(false);

  const socket = useSocket();

  const bids =
    data.handBids
      ?.map((bid) =>
        bid.bids?.map((b) => (data.handCount === b.handNumber ? b.bid : null))
      )
      .flat()
      .filter((s) => s !== undefined) || [];

  const bidSum = bids.reduce((acc: any, bid) => acc + (bid as number), 0);

  const playerIndex = data.rotatedPlayers?.findIndex(
    (p) => p.id === data.currentPlayerId
  );
  const nextPlayerId =
    data.rotatedPlayers[(playerIndex + 1) % data.rotatedPlayers.length].id;

  const handleBidClick = (bid: number) => {
    if (!socket) return;

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
