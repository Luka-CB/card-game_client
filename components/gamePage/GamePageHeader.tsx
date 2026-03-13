"use client";

import useCreateRoomStore from "@/store/gamePage/createRoomStore";
import styles from "./GamePageHeader.module.scss";
import { FaUsers, FaPlus, FaFilter } from "react-icons/fa6";
import { SiAirtable } from "react-icons/si";
import Filters from "./filters/Filters";
import useFilterStore from "@/store/gamePage/filterStore";
import useRoomStore from "@/store/gamePage/roomStore";
import Search from "./cards/search/Search";
import useUserStore from "@/store/user/userStore";

interface propsIFace {
  type: "classic" | "nines" | "betting";
}

const GamePageHeader: React.FC<propsIFace> = ({ type }) => {
  const { setToggleCreateRoom } = useCreateRoomStore();
  const { toggleFilterOptions } = useFilterStore();
  const { rooms } = useRoomStore();
  const { usersOnline } = useUserStore();

  return (
    <header className={styles.header}>
      <div className={styles.col1}>
        <div className={styles.item}>
          <div className={styles.indicator} />
          <FaUsers className={styles.icon} />
          <small>players</small>
          <b>{usersOnline?.length || 0}</b>
        </div>
        <div className={styles.divider}></div>
        <div className={styles.item}>
          <SiAirtable className={styles.icon} />
          <small>rooms</small>
          <b>{rooms?.length || 0}</b>
        </div>
      </div>
      <div className={styles.col2}>
        <div
          className={
            !rooms || rooms.length <= 5 ? styles.disabled : styles.filter
          }
          onClick={(e) => {
            e.stopPropagation();
          }}
          title={
            !rooms || rooms.length <= 5
              ? "Filters disabled when there are 5 or fewer rooms"
              : ""
          }
        >
          <span>Filter Rooms:</span>
          <button
            className={styles.filter_btn}
            disabled={!rooms || rooms.length <= 5}
            onClick={toggleFilterOptions}
          >
            <FaFilter className={styles.icon} />
          </button>
          <Filters />
        </div>
        <div className={styles.col}>
          <Search roomsLength={rooms?.length || 0} />
          <button
            className={styles.create_btn}
            onClick={() => setToggleCreateRoom(true, type)}
          >
            <FaPlus className={styles.icon} />
            <span>Create Room</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default GamePageHeader;
