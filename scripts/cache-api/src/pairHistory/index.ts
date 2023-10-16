import {Request, Response} from "express";
import prisma from "../prisma";
import { serializeBigInt } from "../utils";

export async function getByAddress(req: Request, res: Response) {
  const address = req.params.address;
  const days = req.params.days;

  if(!address) res.status(400).send("Missing pair address");
  if(!days) res.status(400).send("Missing days parameter");

  const pair = await prisma.pair.findFirst({
    where: {
      address: address,
    }
  });

  const pairEntries = await prisma.pairHistory.findMany({
    where: {
      pairId: pair?.id,
      createdAt: {
        gte: Date.now() - 7 * 60 * 60 * 24 * 1000,
      },
    },
  });

  res.json(serializeBigInt(pairEntries));
}

export async function deleteOldEntries() {
  const cutoffDate = Date.now() - 7 * 24 * 60 * 60 * 1000;

  try {
    const deletedPairHistory = await prisma.pairHistory.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return deletedPairHistory;
  } catch (error) {
    console.error('Error deleting entries:', error);
  }
}
