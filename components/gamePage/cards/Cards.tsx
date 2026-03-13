"use client";

import { useEffect } from "react";
import Card from "./card/Card";
import styles from "./Cards.module.scss";
import useSocket from "@/hooks/useSocket";
import useRoomStore from "@/store/gamePage/roomStore";
import useFilterStore from "@/store/gamePage/filterStore";

const Cards = () => {
  const { rooms, setRooms } = useRoomStore();
  const { checkedFilters } = useFilterStore();

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit("getRooms");

    socket.on("getRooms", (data) => {
      setRooms(data);
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
        <p className={styles.empty_message}>No rooms available. Create one!</p>
      )}
    </div>
  );
};

export default Cards;
