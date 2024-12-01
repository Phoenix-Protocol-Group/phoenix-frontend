import fs from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "./stellar.toml");

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");

    return new Response(fileContents, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    return new Response("Error reading stellar.toml", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
