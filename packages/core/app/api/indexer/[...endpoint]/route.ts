// app/api/proxy/[...endpoint]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { endpoint: string[] } }
) {
  const { params } = context;

  // Ensure params is awaited properly
  const endpoint = (await params)?.endpoint || [];
  const query = request.url.split("?")[1]
    ? "?" + request.url.split("?")[1]
    : "";
  const targetUrl = `http://65.21.27.173:5050/${endpoint.join("/")}${query}`;

  const response = await fetch(targetUrl, {
    method: "GET",
    headers: {
      ...request.headers,
    } as HeadersInit,
  });

  const data = await response.text();

  return new NextResponse(data, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(
  request: Request,
  context: { params: { endpoint: string[] } }
) {
  const { params } = context;

  // Ensure params is awaited properly
  const endpoint = (await params)?.endpoint || [];
  const targetUrl = `http://65.21.27.173:5050/${endpoint.join("/")}`;

  const body = await request.text();

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      ...request.headers,
      "Content-Type": "application/json",
    } as HeadersInit,
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
