import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Extract dynamic route segments directly from the pathname
  const pathname = request.nextUrl.pathname;
  const endpoint = pathname.replace("/api/indexer/", ""); // Remove the base path
  const query = request.nextUrl.search || ""; // Extract query parameters
  const targetUrl = `http://65.21.27.173:5050/${endpoint}${query}`;

  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      ...Object.fromEntries(request.headers),
    },
  });

  const data = await response.text();

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(request: NextRequest) {
  // Extract dynamic route segments directly from the pathname
  const pathname = request.nextUrl.pathname;
  const endpoint = pathname.replace("/api/indexer/", ""); // Remove the base path
  const targetUrl = `http://65.21.27.173:5050/${endpoint}`;

  const body = await request.text();

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      ...Object.fromEntries(request.headers),
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.text();

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
