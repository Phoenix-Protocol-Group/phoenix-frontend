import {Request, Response} from "express";
import * as db from "./db";

export async function getAll(req: Request, res: Response) {
  const tokens = await db.getAll();

  res.json(tokens);
}

export async function getByAddress(req: Request, res: Response) {
  if(!req.params.address) res.status(400).send("Missing token address");

  const token = await db.getByAddress(req.params.address);

  return res.json(token);
}
