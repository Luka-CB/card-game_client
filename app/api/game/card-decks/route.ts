import { NextResponse } from "next/server";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET() {
  try {
    const res = await fetch(`${SERVER_URL}/api/card-decks`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ msg: "Server unavailable" }, { status: 503 });
  }
}
