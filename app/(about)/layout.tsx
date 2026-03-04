import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import Loader from "@/components/Loader";

export default async function AboutLayout({
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
