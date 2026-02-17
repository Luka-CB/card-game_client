"use client";

import Image from "next/image";
import styles from "./GetMoreModal.module.scss";
import { IoMdCloseCircle } from "react-icons/io";
import { FaPlay, FaCircleInfo } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";

const GetMoreModal = () => {
  const { isGetMoreModalOpen, toggleGetMoreModal, hasWarning } =
    useJCoinsStore();

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
            <h4>To get more JCoins, you can watch ads below:</h4>
            <div className={styles.ads}>
              <div className={styles.ad}>
                <div className={styles.info}>
                  <h5>Watch 15 seconds of Ad</h5>
                  <div className={styles.ad_reward}>
                    <p>get +50</p>
                    <Image
                      src="/coin1.png"
                      alt="coin"
                      width={25}
                      height={25}
                      className={styles.coin_image}
                    />
                  </div>
                </div>
                <button className={styles.play_btn}>
                  <span>Play Now</span>
                  <FaPlay className={styles.play_icon} />
                </button>
              </div>
              <div className={styles.ad}>
                <div className={styles.info}>
                  <h5>Watch 30 seconds of Ad</h5>
                  <div className={styles.ad_reward}>
                    <p>get +100</p>
                    <Image
                      src="/coin1.png"
                      alt="coin"
                      width={25}
                      height={25}
                      className={styles.coin_image}
                    />
                  </div>
                </div>
                <button className={styles.play_btn}>
                  <span>Play Now</span>
                  <FaPlay className={styles.play_icon} />
                </button>
              </div>
              <div className={styles.ad}>
                <div className={styles.info}>
                  <h5>Watch 45 seconds of Ad</h5>
                  <div className={styles.ad_reward}>
                    <p>get +150</p>
                    <Image
                      src="/coin1.png"
                      alt="coin"
                      width={25}
                      height={25}
                      className={styles.coin_image}
                    />
                  </div>
                </div>
                <button className={styles.play_btn}>
                  <span>Play Now</span>
                  <FaPlay className={styles.play_icon} />
                </button>
              </div>
              <div className={styles.ad}>
                <div className={styles.info}>
                  <h5>Watch 60 seconds of Ad</h5>
                  <div className={styles.ad_reward}>
                    <p>get +200</p>
                    <Image
                      src="/coin1.png"
                      alt="coin"
                      width={25}
                      height={25}
                      className={styles.coin_image}
                    />
                  </div>
                </div>
                <button className={styles.play_btn}>
                  <span>Play Now</span>
                  <FaPlay className={styles.play_icon} />
                </button>
              </div>
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
