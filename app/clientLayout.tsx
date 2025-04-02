"use client";

import "@/styles/globals.scss";
import useUserOptionStore from "../store/user/userOptionStore";
import useUserStore from "../store/user/userStore";
import Loader from "../components/loaders/Loader";
import { useEffect } from "react";
import Header from "@/components/header/Header";
import FlashMsg from "@/components/falshMsg/FlashMsg";
import useFlashMsgStore from "@/store/flashMsgStore";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, setIsOpen } = useUserOptionStore();
  const { getUser, loading } = useUserStore();
  const { msg } = useFlashMsgStore();

  const handleClosePopup = () => {
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <html lang="en">
      <body onClick={handleClosePopup}>
        {loading ? (
          <div className="page_loading">
            <Loader />
          </div>
        ) : (
          <>
            <Header />
            {msg ? <FlashMsg /> : null}
            <main>{children}</main>
          </>
        )}
      </body>
    </html>
  );
}
