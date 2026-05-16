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
import { useTranslations } from "next-intl";

interface propsIFace {
  type: "classic" | "nines" | "betting";
}

const GamePageHeader: React.FC<propsIFace> = ({ type }) => {
  const t = useTranslations("GamePage.header");

  const { setToggleCreateRoom } = useCreateRoomStore();
  const { toggleFilterOptions, checkedFilters } = useFilterStore();
  const { rooms, totalRoomsCount } = useRoomStore();
  const { usersOnline } = useUserStore();
  const { user } = useUserStore();

  const hasActiveFilters =
    checkedFilters.classic ||
    checkedFilters.nines ||
    (!user?.isGuest && checkedFilters.betting) ||
    checkedFilters.public ||
    checkedFilters.private ||
    checkedFilters.chat ||
    Object.values(checkedFilters.penalties).some(Boolean);

  const isFilterDisabled = totalRoomsCount <= 5 && !hasActiveFilters;

  return (
    <header className={styles.header}>
      <div className={styles.col1}>
        {(usersOnline?.length > 500 || user?.isAdmin) && (
          <>
            <div className={styles.item}>
              <div className={styles.indicator} />
              <FaUsers className={styles.icon} />
              <small>{t("players")}</small>
              <b>{usersOnline?.length || 0}</b>
            </div>

            <div className={styles.divider}></div>
          </>
        )}
        <div className={styles.item}>
          <SiAirtable className={styles.icon} />
          <small>{t("rooms")}</small>
          <b>{rooms?.length || 0}</b>
        </div>
      </div>
      <div className={styles.col2}>
        <div
          className={isFilterDisabled ? styles.disabled : styles.filter}
          onClick={(e) => {
            e.stopPropagation();
          }}
          title={isFilterDisabled ? t("filter.disabled") : ""}
        >
          <span>{t("filter.label")}</span>
          <button
            className={styles.filter_btn}
            disabled={isFilterDisabled}
            onClick={toggleFilterOptions}
          >
            <FaFilter className={styles.icon} />
          </button>
          <Filters />
        </div>
        <div className={styles.col}>
          <Search roomsLength={totalRoomsCount || 0} />
          <button
            className={styles.create_btn}
            disabled={user?.isGuest}
            title={user?.isGuest ? "Guests cannot create rooms" : ""}
            onClick={() => setToggleCreateRoom(true, type)}
          >
            <FaPlus className={styles.icon} />
            <span>{t("btn")}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default GamePageHeader;
