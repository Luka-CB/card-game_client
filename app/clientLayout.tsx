"use client";

import "@/app/styles/globals.scss";
import useUserOptionStore from "./store/user/userOptionStore";
import useUserStore from "./store/user/userStore";
import Loader from "./components/loaders/Loader";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, setIsOpen } = useUserOptionStore();
  const { getUser, status } = useUserStore();

  const handleClosePopup = () => {
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <html lang="en">
      <body onClick={handleClosePopup}>
        {status === "loading" ? (
          <div className="page_loading">
            <Loader />
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
