import { PinataSDK } from "pinata-web3";
import { Buffer } from "buffer";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1Mjk1ZmIzNy1jYmU3LTQ0YTYtYmU1OS0yNTE0MTg5ZTc1YTYiLCJlbWFpbCI6InZhcm5vdHVzZWRAcHJvdG9ubWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiN2QxNWYwYWQ1NjVhNzkzZWNlYzYiLCJzY29wZWRLZXlTZWNyZXQiOiJkODQxNWFmYmYyYWM2YzFkODhjODA3NjkzOTI4ODI3Njg4Njc5MmUwZTlkMmU1NDQ3MTkyMWUzOTIwYTY1YWEwIiwiZXhwIjoxNzYzNDc2ODY3fQ._c2rFLrRAc9WZyb9lsnf5jECHcYpaUrEV6-QQcBic-8",
  pinataGateway: process.env.PINATA_GATEWAY || "lime-genetic-whitefish-192.mypinata.cloud",
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !name || !description) {
      return new Response(
        JSON.stringify({ message: "File, name, or description is missing" }),
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileToUpload = new File([fileBuffer], file.name, { type: file.type });

    const fileUploadResponse = await pinata.upload.file(fileToUpload);

    const fileCID = fileUploadResponse.IpfsHash;

    const metadata = {
      name,
      description,
      image: `ipfs://${fileCID}`,
      external_url: "https://pinata.cloud",
    };

    const jsonUploadResponse = await pinata.upload.json(metadata);

    return new Response(
      JSON.stringify(jsonUploadResponse),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in upload handler:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
