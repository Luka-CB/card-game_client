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
import { getStoredRandomAvatar } from "@/utils/misc";
import useRoomStore from "@/store/gamePage/roomStore";

const CreateRoom = () => {
  const [currentStatus, setCurrentStatus] = useState("public");
  const [currentType, setCurrentType] = useState<
    "classic" | "nines" | "betting"
  >("classic");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [bett, setBett] = useState("");
  const [hisht, setHisht] = useState("200");

  const { toggleCreateRoomModal, setToggleCreateRoom } = useCreateRoomStore();
  const { setMsg } = useFlashMsgStore();
  const { setIsCreatingRoom, rooms } = useRoomStore();

  const handleCloseModal = () => setToggleCreateRoom(false, null);

  const socket = useSocket();
  const { user } = useUserStore();

  const resetModal = () => {
    setToggleCreateRoom(false, null);
    setName("");
    setPassword("");
    setBett("");
    setHisht("200");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    const roomUser = rooms.find((room) =>
      room?.users.some((u) => u.id === user._id)
    );
    if (roomUser) {
      setMsg("You can't be in more than one room at the same time", "error");
      resetModal();
      return;
    }

    const room = {
      id: uuidv4(),
      name,
      password: currentStatus === "private" ? password : null,
      bett: currentType === "betting" ? bett : null,
      type: currentType,
      status: currentStatus,
      hisht,
      createdAt: new Date(),
      gameStatus: "waiting",
      users: [
        {
          id: user._id,
          username: user.username,
          avatar: user.avatar || getStoredRandomAvatar(),
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
                  currentType === "classic" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentType("classic")}
              >
                <span>Classic</span>
              </div>
              <div
                className={
                  currentType === "nines" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentType("nines")}
              >
                <span>Nines</span>
              </div>
              <div
                className={
                  currentType === "betting" ? styles.item_active : styles.item
                }
                onClick={() => setCurrentType("betting")}
              >
                <span>Betting</span>
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
              {currentType === "betting" ? (
                <div className={styles.input_box}>
                  <label htmlFor="bett">Amount of Bett</label>
                  <input
                    type="number"
                    name="bett"
                    id="bett"
                    required
                    value={bett}
                    onChange={(e) => setBett(e.target.value)}
                  />
                </div>
              ) : null}
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
                </div>
              </div>
              <button type="submit" className={styles.submit_btn}>
                Create
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CreateRoom;
