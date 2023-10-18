import {Request, Response} from "express";
import { serializeBigInt } from '../utils';
import * as db from "./db";

export async function getByAddress(req: Request, res: Response) {
  if(!req.params.address) res.status(400).send("Missing token address");

  const tokenEntries = await db.getByAddress(req.params.address);

  res.json(serializeBigInt(tokenEntries));
}
