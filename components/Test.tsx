"use client";

import useSocket from "@/hooks/useSocket";
import { useEffect } from "react";

const Test = () => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log("No socket");
      return;
    }

    socket.on("get-message", (data) => {
      console.log("Message Recieved: ", data);
    });

    return () => {
      socket.off("get-message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket?.connected) {
      socket.emit("send-message", { text: "Hello from the client side!" });
    } else {
      console.log("socket not connected");
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>get test message</button>
    </div>
  );
};

export default Test;
