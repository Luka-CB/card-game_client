import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
        transports: ["websocket"],
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  return socket;
}
