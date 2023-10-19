import {Request, Response} from "express";
import { serializeBigInt } from "../utils";
import * as db from "./db";

export async function getByAddress(req: Request, res: Response) {
  const address = req.params.address;

  if(!address) res.status(400).send("Missing pair address");

  const pairEntries = await db.getByAddress(req.params.address)

  res.json(serializeBigInt(pairEntries));
}

export async function getTopGainers(req: Request, res: Response) {
  const pairEntries = await db.getTopGainers();

  res.json(serializeBigInt(pairEntries));
}
