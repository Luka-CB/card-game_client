import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socketSingleton: Socket | null = null;
const socketSubscribers = new Set<(socket: Socket) => void>();

const localSocketUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const productionSocketUrl =
  process.env.NEXT_PUBLIC_API_URL_PROD || "https://api.jokerclash.com";

function publishSocket(socket: Socket) {
  socketSingleton = socket;
  socketSubscribers.forEach((subscriber) => subscriber(socket));
}

function createSocket(url: string) {
  return io(url, { transports: ["websocket"] });
}

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

    if (typeof window === "undefined") return;

    const updateSocket = (nextSocket: Socket) => setSocket(nextSocket);
    socketSubscribers.add(updateSocket);

    if (!socketSingleton) {
      const localSocket = createSocket(localSocketUrl);
      publishSocket(localSocket);

      if (
        process.env.NODE_ENV === "development" &&
        localSocketUrl !== productionSocketUrl
      ) {
        let fallbackTimer: ReturnType<typeof setTimeout>;
        const scheduleProductionFallback = () => {
          clearTimeout(fallbackTimer);
          fallbackTimer = setTimeout(() => {
            if (localSocket.connected || socketSingleton !== localSocket)
              return;

            localSocket.disconnect();
            publishSocket(createSocket(productionSocketUrl));
          }, 5000);
        };

        localSocket.on("connect", () => clearTimeout(fallbackTimer));
        localSocket.on("connect_error", scheduleProductionFallback);
        localSocket.on("disconnect", scheduleProductionFallback);
        scheduleProductionFallback();
      }
    } else {
      setSocket(socketSingleton);
    }

    const handleBeforeUnload = () => {
      socketSingleton?.disconnect();
      socketSingleton = null;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socketSubscribers.delete(updateSocket);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldConnect]);

  return socket;
}
