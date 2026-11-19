import { NextResponse } from "next/server";
import { fetchServerApi } from "@/app/api/_lib/serverApi";

export async function GET() {
  try {
    const res = await fetchServerApi("card-decks", { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ msg: "Server unavailable" }, { status: 503 });
  }
}
