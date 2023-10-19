import "dotenv/config";
import express, {Request, Response} from "express"
import * as token from "./token";
import * as tokenHistory from "./tokenHistory";
import * as pair from "./pair";
import * as pairHistory from "./pairHistory";
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

app.get("/pairs", pair.getAll);
app.get("/pairs/topgainers", pairHistory.getTopGainers);
app.get("/pairs/:address", pair.getByAddress);
app.get("/pairs/:address/history", pairHistory.getByAddress);

app.get("/tokens", token.getAll);
app.get("/tokens/:address", token.getByAddress);
app.get("/tokens/:address/history", tokenHistory.getByAddress);

const server = app.listen(port, () => { console.log(`Listening on port ${port}`) });
