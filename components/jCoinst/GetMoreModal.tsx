"use client";

import Image from "next/image";
import styles from "./GetMoreModal.module.scss";
import { IoMdCloseCircle } from "react-icons/io";
import { FaGift, FaCircleInfo } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";
import { useEffect, useMemo } from "react";
import useFlashMsgStore from "@/store/flashMsgStore";
import BtnLoader from "../loaders/BtnLoader";

const formatTimeLeft = (nextClaimAt: string | null) => {
  if (!nextClaimAt) return "Available now";

  const diffMs = new Date(nextClaimAt).getTime() - Date.now();
  if (diffMs <= 0) return "Available now";

  const totalMinutes = Math.ceil(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h:${minutes}m`;
  }

  return `${totalMinutes}m`;
};

const GetMoreModal = () => {
  const {
    isGetMoreModalOpen,
    toggleGetMoreModal,
    hasWarning,
    dailyClaim,
    dailyClaimStatus,
    fetchDailyClaimStatus,
    claimDailyFreeJCoins,
  } = useJCoinsStore();

  const { setMsg } = useFlashMsgStore();

  useEffect(() => {
    if (isGetMoreModalOpen) {
      document.body.style.overflow = "hidden";
      fetchDailyClaimStatus();
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isGetMoreModalOpen, fetchDailyClaimStatus]);

  const timeLeft = useMemo(
    () => formatTimeLeft(dailyClaim?.nextClaimAt ?? null),
    [dailyClaim?.nextClaimAt],
  );

  const handleClaim = async () => {
    const rewardAmount = await claimDailyFreeJCoins();

    if (!rewardAmount) {
      setMsg("Daily free claim is not available yet.", "error");
      return;
    }

    setMsg(`You received +${rewardAmount} JCoins`, "success");
  };

  return (
    <AnimatePresence>
      {isGetMoreModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.bg}
          onClick={() => toggleGetMoreModal()}
        >
          <motion.div
            initial={{ top: 0 }}
            animate={{ top: "50%", transform: "translateY(-50%)" }}
            exit={{ top: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              type: "spring",
            }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {hasWarning && (
              <div className={styles.warning}>
                <FaCircleInfo className={styles.info_icon} />
                <small>Insufficient JCoins</small>
              </div>
            )}

            <h2>Get More JCoins</h2>
            <h4>Claim your daily free JCoins below.</h4>

            <div className={styles.reward}>
              <div className={styles.info}>
                <h5>Daily Free Claim</h5>

                <div className={styles.amount}>
                  <p>get {dailyClaim?.amount ?? 250}</p>
                  <Image
                    src="/coin1.png"
                    alt="coin"
                    width={25}
                    height={25}
                    className={styles.coin_image}
                  />
                </div>

                {dailyClaim?.canClaim ? (
                  <small>Ready to claim now</small>
                ) : (
                  <small>
                    Next claim in <b>{timeLeft}</b>
                  </small>
                )}
              </div>

              <button
                className={styles.claim_btn}
                onClick={handleClaim}
                disabled={
                  dailyClaimStatus === "loading" || !dailyClaim?.canClaim
                }
              >
                {dailyClaimStatus === "loading" ? (
                  <BtnLoader />
                ) : (
                  <>
                    <span>Claim Now</span>
                    <FaGift className={styles.gift_icon} />
                  </>
                )}
              </button>
            </div>

            <button
              className={styles.close_btn}
              onClick={() => toggleGetMoreModal()}
            >
              <IoMdCloseCircle />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GetMoreModal;
