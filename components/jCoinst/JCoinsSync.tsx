"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useSocket from "@/hooks/useSocket";
import useUserStore from "@/store/user/userStore";
import useJCoinsStore from "@/store/user/stats/jCoinsStore";

const JCoinsSync = () => {
  const socket = useSocket();
  const pathname = usePathname();
  const { user } = useUserStore();
  const { fetchJCoins, clearJCoins } = useJCoinsStore();

  useEffect(() => {
    if (!user || user.isGuest) {
      clearJCoins();
      return;
    }

    fetchJCoins();
  }, [user?._id, user?.isGuest, pathname, fetchJCoins, clearJCoins]);

  useEffect(() => {
    if (!socket || !user?._id || user.isGuest) return;

    const handleJCoinsChanged = (data?: { userIds?: string[] }) => {
      if (!data?.userIds || data.userIds.includes(user._id)) {
        fetchJCoins();
      }
    };

    const handleReconnect = () => {
      fetchJCoins();
    };

    socket.on("jCoinsChanged", handleJCoinsChanged);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("jCoinsChanged", handleJCoinsChanged);
      socket.off("connect", handleReconnect);
    };
  }, [socket, user?._id, user?.isGuest, fetchJCoins]);

  return null;
};

export default JCoinsSync;
