"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import useUserStore from "@/store/user/userStore";
import Loader from "@/components/loaders/Loader";

export default function GameViewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useUserStore();

  useEffect(() => {
    if (!loading && (!user || user.isGuest)) {
      router.replace("/?auth=signin");
    }
  }, [loading, user, router]);

  if (loading || !user || user.isGuest) {
    return <Loader fullPage />;
  }

  return <>{children}</>;
}
