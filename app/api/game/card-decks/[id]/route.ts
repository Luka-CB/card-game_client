import { NextRequest, NextResponse } from "next/server";
import { fetchServerApi } from "@/app/api/_lib/serverApi";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const res = await fetchServerApi(`card-decks/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ msg: "Server unavailable" }, { status: 503 });
  }
}
