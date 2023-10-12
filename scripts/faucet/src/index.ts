import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
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
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const wallet = new OfflineWallet();

const tokens = [
  "CC5BDQ7J2VK4TQHHIMFNVMV5ZJZYDXDZN7XQ7IM73XKKPYF2KKARCOIW",
  "CC6HQVYSKVFCKWU6EKYDILHFOV5DC26VICEUYAMKTIDS4XZPYMDP3WOS",
];

app.get("/fund/:walletId", async (req: Request, res: Response) => {
  const amount = 1000000000;
  const to = req.params.walletId;
  const from = await wallet.getUserInfo();
  const server = new SorobanClient.Server(process.env.RPC_URL);
  let account = await server.getAccount(from.publicKey);

  try {
    let queryResults: any = [];
    console.log("Start Processing!");
    console.log("Crafting TX for Native Asset");
    const nativeTX = await nativeTransaction(
      account,
      server,
      to,
      amount.toString()
    );
    console.log(`Native TX: ${JSON.stringify(nativeTX)}`);
    queryResults.push(nativeTX);

    for (const token of tokens) {
      console.log(`Processing Token: ${token}`);
      const tokenTX = await tokenTransaction(
        account,
        server,
        from.publicKey,
        to,
        amount.toString(),
        token
      );
      console.log(`Token TX: ${JSON.stringify(tokenTX)}`);
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
