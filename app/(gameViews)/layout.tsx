"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/user/userStore";
import Loader from "@/components/loaders/Loader";

export default function GameViewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, getUser } = useUserStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/?auth=signin");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loader />;
  }

  return <>{children}</>;
}
