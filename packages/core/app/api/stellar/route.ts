import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "./stellar.toml");
  const fileContents = fs.readFileSync(filePath, "utf8");

  return new NextResponse(fileContents, {
    status: 200,
    headers: new Headers({
      "Content-Type": "text/plain",
    }),
  });
}
