import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const filePath = path.join(process.cwd(), "./stellar.toml");
  const fileContents = fs.readFileSync(filePath, "utf8");

  return new NextResponse(fileContents, {
    status: 200,
    headers: new Headers({
      "Content-Type": "text/plain",
    }),
  });
}
