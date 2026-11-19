import { NextRequest, NextResponse } from "next/server";
import { fetchServerApi } from "@/app/api/_lib/serverApi";

async function proxyRequest(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const targetPath = path.map(encodeURIComponent).join("/");

    const headers = new Headers(req.headers);
    headers.delete("connection");
    headers.delete("content-length");
    headers.delete("host");

    const body = ["GET", "HEAD"].includes(req.method)
      ? undefined
      : await req.arrayBuffer();
    const response = await fetchServerApi(
      `${targetPath}${req.nextUrl.search}`,
      {
        method: req.method,
        headers,
        body,
        cache: "no-store",
        redirect: "manual",
      },
    );

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("connection");
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ msg: "Server unavailable" }, { status: 503 });
  }
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
