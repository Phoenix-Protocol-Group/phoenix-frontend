import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "./stellar.toml");
  const fileContents = fs.readFileSync(filePath, "utf8");

  return NextResponse.json(fileContents, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
