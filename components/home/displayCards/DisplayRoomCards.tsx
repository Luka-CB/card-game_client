"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import styles from "./DisplayRoomCard.module.scss";
import { MdOpenInNew } from "react-icons/md";
import useSocket from "@/hooks/useSocket";
import { useEffect, useRef, useState } from "react";
import DisplayCard from "./displayCard/DisplayCard";
import { Room } from "@/utils/interfaces";
import useDisplayRoomStore from "@/store/displayRoomStore";
import useUserStore from "@/store/user/userStore";
import { useTranslations } from "next-intl";

const DisplayRoomCards = () => {
  const t = useTranslations("HomePage.displayRoomCards");

  const [classicRoom, setClassicRoom] = useState<Room | null>(null);
  const [ninesRoom, setNinesRoom] = useState<Room | null>(null);
  const [bettingRoom, setBettingRoom] = useState<Room | null>(null);
  const [optimisticClassicRoom, setOptimisticClassicRoom] =
    useState<Room | null>(null);
  const [optimisticNinesRoom, setOptimisticNinesRoom] = useState<Room | null>(
    null,
  );
  const [optimisticBettingRoom, setOptimisticBettingRoom] =
    useState<Room | null>(null);
  const [roomImIn, setRoomImIn] = useState<Room | null>(null);
  const { displayRoomType } = useDisplayRoomStore();
  const { user } = useUserStore();
  const socket = useSocket();
  const pathname = usePathname();
  const router = useRouter();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (!roomImIn || !user) return;
    if (pathname !== "/") return;
    if (hasNavigatedRef.current) return;

    const roomUser = roomImIn.users?.find(
      (u) => u.id === user._id && u.status !== "left",
    );

    const occupiedSeats = (() => {
      const set = new Set<string>();
      for (const u of roomImIn.users || []) {
        if (u?.id && u.status !== "left") set.add(u.id);
      }
      return set.size;
    })();

    if (
      roomImIn.isActive &&
      roomUser &&
      roomUser.status === "active" &&
      occupiedSeats >= 4
    ) {
      hasNavigatedRef.current = true;
      const timeout = setTimeout(() => {
        router.push(`/rooms/${roomImIn.id}`);
      }, 1000);
      return () => {
        clearTimeout(timeout);
        hasNavigatedRef.current = false;
      };
    }
  }, [roomImIn, user?._id, pathname, router]);

  useEffect(() => {
    if (!socket) return;

    const handleClassic = (d: Room | null) => setClassicRoom(d);
    const handleNines = (d: Room | null) => setNinesRoom(d);
    const handleBetting = (d: Room | null) => setBettingRoom(d);
    const handleRoomImIn = (d: Room | null) => setRoomImIn(d);

    const handleRoom = (roomData: Room) => {
      if (!user?._id) return;

      const isCurrentUsersRoom = roomData.users?.some(
        (u) => u.id === user._id && u.status !== "left",
      );

      if (isCurrentUsersRoom) {
        setRoomImIn(roomData);
      }
    };

    socket.on("getDisplayRoomClassic", handleClassic);
    socket.on("getDisplayRoomNines", handleNines);
    socket.on("getDisplayRoomBetting", handleBetting);
    socket.on("getRoomImIn", handleRoomImIn);
    socket.on("getRoom", handleRoom);

    return () => {
      socket.off("getDisplayRoomClassic", handleClassic);
      socket.off("getDisplayRoomNines", handleNines);
      socket.off("getDisplayRoomBetting", handleBetting);
      socket.off("getRoomImIn", handleRoomImIn);
      socket.off("getRoom", handleRoom);
    };
  }, [socket, user?._id]);

  useEffect(() => {
    if (!displayRoomType.withUser) {
      setOptimisticClassicRoom(null);
      setOptimisticNinesRoom(null);
      setOptimisticBettingRoom(null);
    }
  }, [displayRoomType.withUser]);

  useEffect(() => {
    if (!socket) return;
    if (pathname !== "/") return;

    const id = user?._id;

    const map = {
      classic: "getDisplayRoomClassic",
      nines: "getDisplayRoomNines",
      betting: "getDisplayRoomBetting",
    } as const;

    (["classic", "nines", "betting"] as const).forEach((type) => {
      const ev = map[type];
      if (displayRoomType.type === type && displayRoomType.withUser && id) {
        socket.emit(ev, id);
      } else {
        socket.emit(ev);
      }
    });

    if (id) socket.emit("getRoomImIn", id);
  }, [
    socket,
    pathname,
    user?._id,
    displayRoomType.type,
    displayRoomType.withUser,
  ]);

  const shouldPinJoinedCard =
    pathname === "/" &&
    displayRoomType.withUser &&
    roomImIn &&
    roomImIn.users?.some((u) => u.id === user?._id && u.status !== "left");

  const handleOptimisticJoin = (
    room: Room,
    type: "classic" | "nines" | "betting",
  ) => {
    if (type === "classic") setOptimisticClassicRoom(room);
    if (type === "nines") setOptimisticNinesRoom(room);
    if (type === "betting") setOptimisticBettingRoom(room);
  };

  const classicRoomToRender =
    optimisticClassicRoom ||
    classicRoom ||
    (shouldPinJoinedCard && displayRoomType.type === "classic"
      ? roomImIn
      : null);

  const ninesRoomToRender =
    optimisticNinesRoom ||
    ninesRoom ||
    (shouldPinJoinedCard && displayRoomType.type === "nines" ? roomImIn : null);

  const bettingRoomToRender =
    optimisticBettingRoom ||
    bettingRoom ||
    (shouldPinJoinedCard && displayRoomType.type === "betting"
      ? roomImIn
      : null);

  return (
    <div className={styles.cards_container}>
      <h2>{t("title")}</h2>
      <div className={styles.cards}>
        <div className={styles.card_wrapper}>
          {classicRoomToRender ? (
            <DisplayCard
              room={classicRoomToRender}
              type="classic"
              roomImIn={roomImIn}
              onOptimisticJoin={handleOptimisticJoin}
            />
          ) : (
            <Info type="classic" />
          )}
          <h3>{t("cards.classic")}</h3>
          <Link href="/rooms">
            <button className={styles.info_btn} title={t("linkTitle")}>
              <MdOpenInNew />
            </button>
          </Link>
        </div>

        <div className={styles.card_wrapper}>
          {ninesRoomToRender ? (
            <DisplayCard
              room={ninesRoomToRender}
              type="nines"
              roomImIn={roomImIn}
              onOptimisticJoin={handleOptimisticJoin}
            />
          ) : (
            <Info type="nines" />
          )}
          <h3>{t("cards.nines")}</h3>
          <Link href="/rooms">
            <button className={styles.info_btn} title={t("linkTitle")}>
              <MdOpenInNew />
            </button>
          </Link>
        </div>

        <div className={styles.card_wrapper}>
          {bettingRoomToRender ? (
            <DisplayCard
              room={bettingRoomToRender}
              type="betting"
              roomImIn={roomImIn}
              onOptimisticJoin={handleOptimisticJoin}
            />
          ) : (
            <Info type="betting" />
          )}
          <h3>{t("cards.bet")}</h3>
          <Link href="/rooms">
            <button className={styles.info_btn} title={t("linkTitle")}>
              <MdOpenInNew />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DisplayRoomCards;

const Info = ({ type }: { type: string }) => {
  const t = useTranslations("HomePage.displayRoomCards.info");

  return (
    <div className={styles.notice}>
      <p>{`${type === "classic" ? t("paragraph.types.classic") : type === "nines" ? t("paragraph.types.nines") : t("paragraph.types.bet")} ${t("paragraph.text")}`}</p>
      <small>{`${t("small.textOne")} ${type} ${t("small.textTwo")}`}</small>
      <Link href="/rooms">
        <button className={styles.notice_btn}>{t("btn")}</button>
      </Link>
    </div>
  );
};
