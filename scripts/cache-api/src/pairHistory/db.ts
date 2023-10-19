import prisma from "../prisma";
import * as pair from "../pair/db";

export async function getByAddress(address: string) {
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

  return pairEntries;
}

export async function create(pair: any) {
  const newPair = await prisma.pairHistory.create({
    data: pair,
  });

  return newPair;
}

export async function getTopGainers() {
  const pairs = await pair.getAll();

  let topGainers = [];

  for(const pair of pairs) {
    const pairEntries = await prisma.pairHistory.findMany({
      where: {
        pairId: pair.id,
        createdAt: {
          gte: Date.now() - 1 * 60 * 60 * 24 * 1000,
        },
      },
    });

    //const gain = ((pairEntries[pairEntries.length - 1] - pairEntries[0]) / pairEntries[0]) * 100;

    topGainers.push({
      pair: pair.id,
      pairEntries: [
        pairEntries[0],
        pairEntries[pairEntries.length - 1],
      ],
    });
  }
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
