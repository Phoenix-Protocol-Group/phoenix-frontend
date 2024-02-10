import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { targetUrl } = body;
  if (!targetUrl) {
    return new NextResponse(
      JSON.stringify({ message: "targetUrl parameter is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    // Forward the request to the target API
    const apiResponse = await fetch(targetUrl, {
      method: "GET", // or 'POST'
      headers: {
        // Forward any headers you need
        "Content-Type": "application/json",
        // Include other headers as required by the target API
      },
      // If POST method, send body as JSON
      // body: JSON.stringify(req.body),
    });

    // Extract the JSON data
    const data = await apiResponse.json();

    // Return the data as JSON
    return new NextResponse(JSON.stringify({ data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle any errors
    console.error("Request failed", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
