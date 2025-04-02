"use client";

import { useEffect } from "react";
import Card from "./Card";
import styles from "./Cards.module.scss";
import useSocket from "@/hooks/useSocket";
import useRoomStore from "@/store/gamePage/roomStore";
import useUserStore from "@/store/user/userStore";

interface propsIFace {
  type: string;
}

const Cards: React.FC<propsIFace> = ({ type }) => {
  const { rooms, setRooms } = useRoomStore();
  const { user, setIsInRoom } = useUserStore();

  console.log(user);

  const socket = useSocket();

  useEffect(() => {
    if (rooms.length > 0 && user) {
      const roomUsers = rooms.map((room) => room.users).flat();
      const isUserInRoom = roomUsers.some(
        (roomUser) => roomUser.id === user._id
      );
      if (isUserInRoom !== user.isInRoom) {
        setIsInRoom(isUserInRoom);
      }
    }
  }, [rooms, user]);

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
      {rooms?.map((room) => (
        <Card key={room.id} room={type === room.type ? room : null} />
      ))}
    </div>
  );
};

export default Cards;
