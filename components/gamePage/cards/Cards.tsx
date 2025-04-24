"use client";

import { useEffect } from "react";
import Card from "./card/Card";
import styles from "./Cards.module.scss";
import useSocket from "@/hooks/useSocket";
import useRoomStore from "@/store/gamePage/roomStore";

const Cards = () => {
  const { rooms, setRooms } = useRoomStore();

  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log("No socket");
      return;
    }

    socket.emit("getRooms");

    socket.on("getRooms", (data) => {
      setRooms(data);
    });

    return () => {
      socket.off("getRooms");
    };
  }, [socket]);

  return (
    <div className={styles.room_cards}>
      {rooms?.length > 0 ? (
        rooms
          .filter((room) => room && room.id) // Filter out invalid rooms
          .map((room) => <Card key={room.id} room={room} />) // Use room.id as the key
      ) : (
        <p className={styles.empty_message}>No rooms available. Create one!</p>
      )}
    </div>
  );
};

export default Cards;
