"use client";

import useUserOptionStore from "../store/user/userOptionStore";
import useUserStore from "../store/user/userStore";
import Loader from "../components/loaders/Loader";
import { useEffect } from "react";
import Header from "@/components/header/Header";
import FlashMsg from "@/components/falshMsg/FlashMsg";
import useFlashMsgStore from "@/store/flashMsgStore";
import { usePathname } from "next/navigation";
import useLastPlayedCardsStore from "@/store/gamePage/lastPlayedCardsStore";
import GetMoreModal from "@/components/jCoinst/GetMoreModal";
import Footer from "@/components/footer/Footer";
import CookieConsent from "@/components/CookieConsent";
import useFilterStore from "@/store/gamePage/filterStore";
import useSocket from "@/hooks/useSocket";
import AvatarGallery from "@/components/auth/LeftPanel/AvatarGallery";
import LevelUpNotification from "@/components/levelUp/LevelUpNotification";
import useLevelUpStore from "@/store/levelUpStore";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, setIsOpen } = useUserOptionStore();
  const { getUser, loading, setUsersOnline } = useUserStore();
  const { msg } = useFlashMsgStore();
  const { setLevelUp } = useLevelUpStore();
  const user = useUserStore((s) => s.user);
  const { showFilterOptions, toggleFilterOptions } = useFilterStore();
  const { toggleLastPlayedCardsModal, setToggleLastPlayedCards } =
    useLastPlayedCardsStore();
  const pathname = usePathname();
  const socket = useSocket(!loading);

  const isGameRoom = pathname?.includes("/rooms/");

  const handleClosePopup = () => {
    if (isOpen) setIsOpen(false);
    if (toggleLastPlayedCardsModal) setToggleLastPlayedCards(false);
    if (showFilterOptions) toggleFilterOptions();
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (onlineUsers: string[]) => {
      setUsersOnline(onlineUsers);
    };

    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !user?._id || user.isGuest) return;

    const handleLevelUp = (data: {
      levelUps: { playerId: string; fromLevel: string; toLevel: string }[];
    }) => {
      const mine = data?.levelUps?.find((lu) => lu.playerId === user._id);
      if (mine) {
        setLevelUp({ fromLevel: mine.fromLevel, toLevel: mine.toLevel });
      }
    };

    socket.on("levelUp", handleLevelUp);

    return () => {
      socket.off("levelUp", handleLevelUp);
    };
  }, [socket, user?._id, user?.isGuest, setLevelUp]);

  return (
    <div className="app-root" onClick={handleClosePopup}>
      {loading ? (
        <div className="page_loading">
          <Loader />
        </div>
      ) : (
        <>
          {!isGameRoom && <Header />}
          {msg ? <FlashMsg /> : null}
          <main>{children}</main>
        </>
      )}
      <GetMoreModal />
      {!isGameRoom && <Footer />}
      <CookieConsent />
      <AvatarGallery />
      <LevelUpNotification />
    </div>
  );
}
