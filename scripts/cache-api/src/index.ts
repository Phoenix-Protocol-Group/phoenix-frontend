import "dotenv/config";
import express, {Request, Response} from "express"
import { Context, createContext } from "./context";
import * as db from "./db";
import * as fetch from "./fetch";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

fetch.startFetch();

app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response) => {
  res.send("Cache API is running");
});

app.get("/pairs", async (req: Request, res: Response) => {
  const pairs = await db.getPairs();

  res.json(pairs);
});

app.get("/pairs/:address", async (req: Request, res: Response) => {
  if(!req.params.address) res.status(400).send("Missing pair address");

  const pair = await db.getPair(req.params.address);
  return res.json(pair);
});

app.get("/pairs/:address/:days", async (req: Request, res: Response) => {
  const address = req.params.address;
  const days = req.params.days;

  if(!address) res.status(400).send("Missing pair address");
  if(!days) res.status(400).send("Missing days parameter");

  const pairs = await db.getPairLiquidity(address, Number(days));

  res.json(pairs);
});

app.get("/tokens", async (req: Request, res: Response) => {
  const tokens = await db.getTokens();

  res.json(tokens);
});

app.get("/tokens/:address", async (req: Request, res: Response) => {
  if(!req.params.address) res.status(400).send("Missing token address");

  const token = await db.getToken(req.params.address);
  return res.json(token);
});

const server = app.listen(port, () => { console.log(`Listening on port ${port}`) });
