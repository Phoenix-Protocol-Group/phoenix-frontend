import prisma from "../prisma";

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
