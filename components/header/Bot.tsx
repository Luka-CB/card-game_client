"use client";

import { useState, useRef, useEffect } from "react";
import { FaRobot } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa6";
import useFilterStore from "@/store/gamePage/filterStore";
import useSocket from "@/hooks/useSocket";
import { useTranslations } from "next-intl";
import styles from "./Bot.module.scss";

const Bot = () => {
  const t = useTranslations("Header.bot");
  const { checkedFilters, setCheckedFilters } = useFilterStore();
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const simulationOn = !checkedFilters.hideDummyRooms;

  // Sync persisted filter/preference to server on socket connect (page reload)
  useEffect(() => {
    if (!socket) return;
    socket.emit("setSimulationPreference", !checkedFilters.hideDummyRooms);
    if (checkedFilters.hideDummyRooms) {
      socket.emit("getRooms", checkedFilters);
    }
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggleSimulation = () => {
    const next = {
      ...checkedFilters,
      hideDummyRooms: !checkedFilters.hideDummyRooms,
    };
    setCheckedFilters(next);
    socket?.emit("getRooms", next);
    socket?.emit("setSimulationPreference", !next.hideDummyRooms);
  };

  const richStrong = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <div className={styles.bot_container} ref={ref}>
      <div className={styles.trigger} onClick={() => setOpen((p) => !p)}>
        <div className={styles.bot_icon_wrapper}>
          <FaRobot
            className={`${styles.bot_icon} ${!simulationOn ? styles.bot_icon_off : ""}`}
          />
          <span
            className={`${styles.indicator} ${!simulationOn ? styles.indicator_off : ""}`}
          />
        </div>

        <div className={`${styles.caret} ${open ? styles.caret_open : ""}`}>
          <FaCaretDown />
        </div>
      </div>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdown_header}>
            <FaRobot className={styles.dropdown_icon} />
            <h3>{t("title")}</h3>
          </div>

          <div className={styles.body_text}>
            <p>{t("description.p1")}</p>
            <p>{t.rich("description.p2", { strong: richStrong })}</p>
            <p>{t.rich("description.p3", { strong: richStrong })}</p>
            <p>{t.rich("description.p4", { strong: richStrong })}</p>
          </div>

          <div className={styles.toggle_row}>
            <div>
              <div className={styles.toggle_label}>
                {simulationOn ? t("toggle.on") : t("toggle.off")}
              </div>
              <div className={styles.toggle_label_muted}>
                {simulationOn ? t("toggle.onSub") : t("toggle.offSub")}
              </div>
            </div>

            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={simulationOn}
                onChange={toggleSimulation}
              />
              <span className={styles.toggle_slider} />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bot;
