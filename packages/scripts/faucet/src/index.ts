import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'
import { OfflineWallet } from "./wallet";
import * as SorobanClient from "soroban-client";
import { nativeTransaction, tokenTransaction } from "./transactions";

const app = express();

app.use(express.json());
app.use(cors());

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

const tokens = [
  "CC2AFR54TLYXIPAVIBV4XGTZ6KIPF4HCHZ7YJUS2HYQEDZJ7XKFJLKIE"
];

app.post("/fund", async (req: Request, res: Response) => {
  const { to, amount } = req.body;

  const from = await wallet.getUserInfo();
  const server = new SorobanClient.Server(process.env.RPC_URL);
  let account = await server.getAccount(from.publicKey);

  try {
    let queryResults: any = [];

    const nativeTX = await nativeTransaction(account, server, to, amount);
    queryResults.push(nativeTX);

    for(const token of tokens) {
      const tokenTX = await tokenTransaction(account, server, from.publicKey, to, amount, token);
      queryResults.push(tokenTX);
    }

    res.json({
      status: "SUCCESS",
      transactions: queryResults,
    });

  } catch (error) {
    console.log(error);
    res.json({
      status: "ERROR",
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
