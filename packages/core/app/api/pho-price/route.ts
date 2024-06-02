import { fetchPho } from "@phoenix-protocol/contracts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = new NextResponse(JSON.stringify(await fetchPho()));
  response.headers.set("Cache-Control", "public, s-maxage=1");
  return response;
}
