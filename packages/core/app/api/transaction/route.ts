import { NextRequest, NextResponse } from "next/server";
import { Transaction, Keypair, Operation } from "@stellar/stellar-sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transaction } = body;

    if (!transaction) {
      return new NextResponse(
        JSON.stringify({ message: "Transaction parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const networkPassphrase: string = "Public Global Stellar Network ; September 2015";
    const tx = new Transaction(transaction, networkPassphrase);
    for (const op of tx.operations as Operation[]) {
      if (op.type === "manageData" && op.name === "client_domain") {
        const anchorPrivateKey = process.env.ANCHOR_PRIVATE_KEY!;
        tx.sign(Keypair.fromSecret(anchorPrivateKey));
      }
    }
    return new NextResponse(JSON.stringify({ signedTransaction: tx.toXDR() }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
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
