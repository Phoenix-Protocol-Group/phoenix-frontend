import {Request, Response} from "express";
import prisma from "../prisma";
import { serializeBigInt } from '../utils';

export async function getAll(req: Request, res: Response) {
  const pairs = await prisma.pair.findMany({
    include: {
      assetA: true,
      assetB: true,
      assetShare: true,
    }
  });

  res.json(serializeBigInt(pairs));
}

export async function getByAddress(req: Request, res: Response) {
  if(!req.params.address) res.status(400).send("Missing pair address");

  const pair = await prisma.pair.findFirst({
    where: {
      address: req.params.address,
    },
    include: {
      assetA: true,
      assetB: true,
      assetShare: true,
    }
  });

  res.json(serializeBigInt(pair));
}
