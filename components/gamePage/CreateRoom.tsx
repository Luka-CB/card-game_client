"use client";

import { createPortal } from "react-dom";
import styles from "./CreateRoom.module.scss";
import { FaLock, FaLockOpen, FaTimesCircle } from "react-icons/fa";
import { FormEvent, useState } from "react";
import useCreateRoomStore from "@/store/gamePage/createRoomStore";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useFlashMsgStore from "@/store/flashMsgStore";
import { getRandomBotAvatar, getRandomColor } from "@/utils/misc";
import useRoomStore from "@/store/gamePage/roomStore";
import Image from "next/image";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";

const CreateRoom = () => {
  const [currentStatus, setCurrentStatus] = useState("public");
  const [currentTab, setCurrentTab] = useState<"classic" | "nines">("classic");
  const [type, setType] = useState<"classic" | "nines">("classic");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [bett, setBett] = useState("");
  const [bettError, setBettError] = useState("");
  const [hisht, setHisht] = useState("200");
  const [toggleChat, setToggleChat] = useState(false);

  const { toggleCreateRoomModal, setToggleCreateRoom } = useCreateRoomStore();
  const { setMsg } = useFlashMsgStore();
  const { setIsCreatingRoom, rooms } = useRoomStore();

  const handleCloseModal = () => setToggleCreateRoom(false, null);

  const socket = useSocket();
  const { user } = useUserStore();
  const { jCoins, toggleGetMoreModal } = useJCoinsStore();

  const resetModal = () => {
    setToggleCreateRoom(false, null);
    setName("");
    setPassword("");
    setBett("");
    setHisht("200");
    setToggleChat(false);
    setBettError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const roomUser = rooms.find((room) =>
      room?.users.some((u) => u.id === user._id),
    );
    if (roomUser) {
      setMsg("You can't be in more than one room at the same time", "error");
      resetModal();
      return;
    }

    if (bett && parseInt(bett) < 50) {
      setBettError("Bett must be at least 50");
      return;
    }

    if (bett && jCoins && parseInt(bett) > jCoins.raw) {
      setBettError("You don't have enough JCoins");
      return;
    }

    if (jCoins && jCoins.raw < 100) {
      toggleGetMoreModal(true);
      setMsg("You need at least 100 JCoins to create a room", "error");
      resetModal();
      return;
    }

    const room = {
      id: uuidv4(),
      name,
      password: currentStatus === "private" ? password : null,
      bett: bett ? bett : null,
      type: type,
      status: currentStatus,
      hisht,
      hasChat: toggleChat,
      createdAt: new Date(),
      users: [
        {
          id: user._id,
          username: user.originalUsername,
          status: "active",
          avatar: user.avatar || "/default-avatar.jpeg",
          botAvatar: getRandomBotAvatar(),
          color: getRandomColor(),
        },
      ],
    };

    setIsCreatingRoom(true);

    if (socket) {
      socket.emit("addRoom", room, user._id);
      socket.emit("getRooms");
      resetModal();
    }
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {toggleCreateRoomModal.toggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={styles.modal_bg}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.3, type: "spring" }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimesCircle
              className={styles.close_icon}
              onClick={handleCloseModal}
            />
            <div className={styles.game_type}>
              <div
                className={
                  currentTab === "classic" ? styles.item_active : styles.item
                }
                onClick={() => {
                  setCurrentTab("classic");
                  setType("classic");
                }}
              >
                <span>Classic</span>
              </div>
              <div
                className={
                  currentTab === "nines" ? styles.item_active : styles.item
                }
                onClick={() => {
                  setCurrentTab("nines");
                  setType("nines");
                }}
              >
                <span>Nines</span>
              </div>
            </div>
            <div className={styles.visibility}>
              <div
                className={
                  currentStatus === "public" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentStatus("public")}
              >
                <FaLockOpen className={styles.icon} />
                <span>Public</span>
              </div>
              <div
                className={
                  currentStatus === "private" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentStatus("private")}
              >
                <FaLock className={styles.icon} />
                <span>Private</span>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.input_box}>
                <label htmlFor="name">Room Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {currentStatus === "private" ? (
                <div className={styles.input_box}>
                  <label htmlFor="password">Create Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              ) : null}
              <div
                className={bettError ? styles.bet_box_error : styles.bet_box}
              >
                <label htmlFor="bett">Bett (optional):</label>
                <input
                  type="number"
                  name="bett"
                  id="bett"
                  value={bett}
                  onChange={(e) => {
                    setBett(e.target.value);
                    setBettError("");
                  }}
                />
                <div className={styles.info}>
                  <small>Minimum bet:</small>
                  <Image src="/coin1.png" alt="coin" width={20} height={20} />
                  <b>50</b>
                </div>
                {bettError && (
                  <span className={styles.error_message}>{bettError}</span>
                )}
              </div>
              <div className={styles.radio_box}>
                <b>Hisht:</b>
                <div className={styles.inputs}>
                  <input
                    type="radio"
                    name="hisht"
                    id="hisht_200"
                    required
                    value={200}
                    checked={hisht === "200"}
                    onChange={(e) => setHisht(e.target.value)}
                  />
                  <label htmlFor="hisht_200">200</label>
                  <input
                    type="radio"
                    name="hisht"
                    id="hisht_500"
                    required
                    value={500}
                    checked={hisht === "500"}
                    onChange={(e) => setHisht(e.target.value)}
                  />
                  <label htmlFor="hisht_500">500</label>
                  <input
                    type="radio"
                    name="hisht"
                    id="hisht_900"
                    required
                    value={900}
                    checked={hisht === "900"}
                    onChange={(e) => setHisht(e.target.value)}
                  />
                  <label htmlFor="hisht_900">900</label>
                </div>
              </div>
              <div className={styles.toggle_box}>
                <span>In Game Chat:</span>
                <label htmlFor="toggleChat" className={styles.toggle_switch}>
                  <input
                    type="checkbox"
                    name="toggleChat"
                    id="toggleChat"
                    checked={toggleChat}
                    onChange={(e) => setToggleChat(e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
                <small>{toggleChat ? "On" : "Off"}</small>
              </div>
              <button type="submit" className={styles.submit_btn}>
                Create
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CreateRoom;
