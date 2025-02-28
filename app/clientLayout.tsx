"use client";

import "@/app/styles/globals.scss";
import useUserOptionStore from "./store/userOptionStore";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, setIsOpen } = useUserOptionStore();

  const handleClosePopup = () => {
    if (isOpen) setIsOpen(false);
  };

  return (
    <html lang="en">
      <body onClick={handleClosePopup}>
        <main>{children}</main>
      </body>
    </html>
  );
}
