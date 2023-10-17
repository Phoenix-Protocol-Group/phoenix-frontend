import prisma from "../prisma";

export async function getByAddress(address: string) {
  const token = await prisma.token.findFirst({
    where: {
      address: address,
    }
  });

  const tokenEntries = await prisma.tokenHistory.findMany({
    where: {
      tokenId: token?.id,
      createdAt: {
        gte: Date.now() - 7 * 60 * 60 * 24 * 1000,
      },
    },
  });

  return tokenEntries;
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
