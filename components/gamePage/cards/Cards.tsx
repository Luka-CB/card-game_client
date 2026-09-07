"use client";

import { useEffect } from "react";
import Card from "./card/Card";
import styles from "./Cards.module.scss";
import useSocket from "@/hooks/useSocket";
import useRoomStore from "@/store/gamePage/roomStore";
import useFilterStore from "@/store/gamePage/filterStore";
import { Room } from "@/utils/interfaces";
import { useTranslations } from "next-intl";
import GuestModal from "@/components/gamePage/GuestModal";

interface GetRoomsPayload {
  rooms: Room[];
  totalRoomsCount: number;
}

const Cards = () => {
  const t = useTranslations("GamePage.cards");

  const { rooms, setRooms } = useRoomStore();
  const { checkedFilters } = useFilterStore();

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const requestRooms = () => {
      const latestFilters = useFilterStore.getState().checkedFilters;
      socket.emit("getRooms", latestFilters);
    };

    socket.emit("getRooms");

    socket.on("getRooms", (data: Room[] | GetRoomsPayload) => {
      if (Array.isArray(data)) {
        setRooms(data, data.length);
        return;
      }

      setRooms(data.rooms, data.totalRoomsCount);
    });

    socket.io.on("reconnect", requestRooms);

    return () => {
      socket.off("getRooms");
      socket.io.off("reconnect", requestRooms);
    };
  }, [socket, setRooms]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getRooms", checkedFilters);
  }, [socket, checkedFilters]);

  return (
    <>
      <GuestModal />
      <div className={styles.room_cards}>
        {rooms?.length > 0 ? (
          rooms
            .filter((room) => room && room.id)
            .map((room) => <Card key={room.id} room={room} />)
        ) : (
          <p className={styles.empty_message}>{t("msg")}</p>
        )}
      </div>
    </>
  );
};

export default Cards;
