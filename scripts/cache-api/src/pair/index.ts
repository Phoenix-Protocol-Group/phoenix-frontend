import {Request, Response} from "express";
import { serializeBigInt } from '../utils';
import * as db from "./db";

export async function getAll(req: Request, res: Response) {
  const pairs = await db.getAll();

  res.json(serializeBigInt(pairs));
}

export async function getByAddress(req: Request, res: Response) {
  if(!req.params.address) res.status(400).send("Missing pair address");

  const pair = await db.getByAddress(req.params.address);

  res.json(pair);
}
