"use client";

import useCreateRoomStore from "@/store/gamePage/createRoomStore";
import styles from "./GamePageHeader.module.scss";
import { FaUsers, FaPlus } from "react-icons/fa6";
import { SiAirtable } from "react-icons/si";
import { IoSearch } from "react-icons/io5";

interface propsIFace {
  type: "classic" | "nines" | "betting";
}

const GamePageHeader: React.FC<propsIFace> = ({ type }) => {
  const { setToggleCreateRoom } = useCreateRoomStore();

  return (
    <header className={styles.header}>
      <div className={styles.col1}>
        <div className={styles.item}>
          <div className={styles.indicator}></div>
          <FaUsers className={styles.icon} />
          <small>players</small>
          <b>5689</b>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.item}>
          <SiAirtable className={styles.icon} />
          <small>rooms</small>
          <b>246</b>
        </div>
      </div>
      <div className={styles.col2}>
        <div className={styles.search_bar}>
          <input type="text" placeholder="Search rooms..." />
          <div className={styles.search_icon}>
            <IoSearch />
          </div>
        </div>
        <button
          className={styles.create_btn}
          onClick={() => setToggleCreateRoom(true, type)}
        >
          <FaPlus className={styles.icon} />
          <span>Create Room</span>
        </button>
      </div>
    </header>
  );
};

export default GamePageHeader;
