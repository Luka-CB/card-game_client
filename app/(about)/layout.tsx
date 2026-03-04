import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("sid")?.value;

  if (!token) {
    redirect("/");
  }

  return <>{children}</>;
}
