import {Request, Response} from "express";
import prisma from "../prisma";
import { serializeBigInt } from '../utils';

export async function getByAddress(req: Request, res: Response) {
  if(!req.params.address) res.status(400).send("Missing token address");


}

export async function deleteOldEntries() {
  const cutoffDate = Date.now() - 7 * 24 * 60 * 60 * 1000;

  try {
    const deletedTokenHistory = await prisma.tokenHistory.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return deletedTokenHistory;
  } catch (error) {
    console.error('Error deleting entries:', error);
  }
}
