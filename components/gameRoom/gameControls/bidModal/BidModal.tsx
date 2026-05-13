import useSocket from "@/hooks/useSocket";
import styles from "./BidModal.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { HandBid, RoomUser } from "@/utils/interfaces";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("GameRoom.GameControls.bidModal");

  const [choosingBid, setChoosingBid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const socket = useSocket();

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.14,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1,
        ease: "easeIn",
      },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 22,
      scale: 0.96,
      filter: "blur(2px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 420,
        damping: 30,
        mass: 0.7,
        staggerChildren: 0.015,
        delayChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      y: 12,
      scale: 0.98,
      transition: {
        duration: 0.12,
        ease: "easeIn",
      },
    },
  };

  const bidItemVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 28,
      },
    },
  };

  const bids =
    data.handBids
      ?.map((bid) =>
        bid.bids?.map((b) => (data.handCount === b.handNumber ? b.bid : null)),
      )
      .flat()
      .filter((s) => s !== undefined) || [];

  const bidSum = bids.reduce((acc: number, bid) => acc + (bid as number), 0);

  const handleBidClick = (bid: number) => {
    if (!socket) return;

    setChoosingBid(true);

    socket.emit("updateBids", data.roomId, {
      playerId: data.currentPlayerId,
      gameHand: data.currentHand,
      bid,
    });
  };

  useEffect(() => {
    setChoosingBid(false);
  }, [data.currentPlayerId]);

  useEffect(() => {
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={`${data.currentPlayerId}-${data.handCount}-${data.currentHand}`}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={styles.modal_bg}
      >
        <motion.div variants={modalVariants} className={styles.modal}>
          <h4>{t("title")}</h4>
          <div className={styles.bids}>
            {Array.from({ length: data.currentHand + 1 }).map((_, index) => {
              const isDisabled =
                choosingBid ||
                (data.currentPlayerId === data.dealerId &&
                  bidSum + index === data.currentHand);

              return (
                <motion.button
                  key={index}
                  variants={bidItemVariants}
                  className={`${styles.bid_btn} ${choosingBid ? styles.submitting : ""}`}
                  onClick={() => handleBidClick(index)}
                  whileHover={!isDisabled ? { scale: 1.06, y: -2 } : undefined}
                  whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                  disabled={isDisabled}
                >
                  {index === 0 ? "-" : index}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

export default BidModal;
