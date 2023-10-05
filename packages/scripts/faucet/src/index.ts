import "dotenv/config";
import express, { Request, Response } from "express";
import { rateLimit } from 'express-rate-limit'
import { OfflineWallet } from "./wallet";
import * as SorobanClient from "soroban-client";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	standardHeaders: 'draft-7',
	legacyHeaders: false,
})

// Apply the rate limiting middleware to all requests
app.use(limiter)

const wallet = new OfflineWallet();

let keypair = SorobanClient.Keypair.fromSecret(process.env.SECRET_KEY);

app.post("/fund", async (req: Request, res: Response) => {
  const { to, amount } = req.body;

  const from = await wallet.getUserInfo();
  const server = new SorobanClient.Server(process.env.RPC_URL);
  let account = await server.getAccount(from.publicKey);

  try {
    let transaction = new SorobanClient.TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: SorobanClient.Networks.FUTURENET,
    })
      .addOperation(
        SorobanClient.Operation.payment({
          destination: to,
          asset: SorobanClient.Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(SorobanClient.TimeoutInfinite)
      .build();
    transaction.sign(keypair);
    console.log(transaction);
    const transactionRes = await server.sendTransaction(transaction);
    console.log(res);

    let queryResult;
    do {
      await new Promise((resolve) => setTimeout(resolve, 200));
      queryResult = await server.getTransaction(transactionRes.hash);
      console.log(queryResult)

    } while (queryResult.status !== "SUCCESS");

    res.json({
      status: "SUCCESS",
      transaction: queryResult,
    });

  } catch (error) {
    res.json({
      status: "ERROR",
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
