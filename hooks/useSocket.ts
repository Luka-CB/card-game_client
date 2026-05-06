import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socketSingleton: Socket | null = null;

export const reconnectSocket = () => {
  if (socketSingleton) {
    socketSingleton.disconnect();
    socketSingleton.connect();
  }
};

export default function useSocket(shouldConnect: boolean = true) {
  const [socket, setSocket] = useState<Socket | null>(socketSingleton);

  useEffect(() => {
    if (!shouldConnect) return;

    if (socketSingleton) {
      setSocket(socketSingleton);
      return;
    }

    if (typeof window === "undefined") return;

    socketSingleton = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
    });

    setSocket(socketSingleton);

    const handleBeforeUnload = () => {
      socketSingleton?.disconnect();
      socketSingleton = null;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConnect]);

  return socket;
}
