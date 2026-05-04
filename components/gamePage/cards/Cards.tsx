"use client";

import { useEffect } from "react";
import Card from "./card/Card";
import styles from "./Cards.module.scss";
import useSocket from "@/hooks/useSocket";
import useRoomStore from "@/store/gamePage/roomStore";
import useFilterStore from "@/store/gamePage/filterStore";
import { Room } from "@/utils/interfaces";
import { useTranslations } from "next-intl";

interface GetRoomsPayload {
  rooms: Room[];
  totalRoomsCount: number;
}

const Cards = () => {
  const t = useTranslations("GamePage.cards");

  const { rooms, setRooms } = useRoomStore();
  const { checkedFilters } = useFilterStore();

  const socket = useSocket();

  console.log(rooms);

  useEffect(() => {
    if (!socket) return;

    socket.emit("getRooms");

    socket.on("getRooms", (data: Room[] | GetRoomsPayload) => {
      if (Array.isArray(data)) {
        setRooms(data, data.length);
        return;
      }

      setRooms(data.rooms, data.totalRoomsCount);
    });

    return () => {
      socket.off("getRooms");
    };
  }, [socket, setRooms]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getRooms", checkedFilters);
  }, [socket, checkedFilters]);

  return (
    <div className={styles.room_cards}>
      {rooms?.length > 0 ? (
        rooms
          .filter((room) => room && room.id)
          .map((room) => <Card key={room.id} room={room} />)
      ) : (
        <p className={styles.empty_message}>{t("msg")}</p>
      )}
    </div>
  );
};

export default Cards;
