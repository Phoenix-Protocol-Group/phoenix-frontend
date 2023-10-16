import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getPairs() {
  const pairs = await prisma.pair.findMany({
    include: {
      assetA: true,
      assetB: true,
      assetShare: true,
    }
  });

  return serializeBigInt(pairs);
}

export async function createPair(pair: any) {
  const newPair = await prisma.pair.create({
    data: pair,
  });

  return newPair;
}

export async function createPairHistory(pair: any) {
  const newPair = await prisma.pairHistory.create({
    data: pair,
  });

  return newPair;
}

export async function getOrCreateToken(address: string) {
  const token = await getToken(address);

  if(token !== null) return token;

  const newToken = await prisma.token.create({
    data: {
      address: address
    },
  });

  return newToken;
}

export async function getPair(address: string) {
  const pair = await prisma.pair.findFirst({
    where: {
      address: address,
    },
    include: {
      assetA: true,
      assetB: true,
      assetShare: true,
    }
  });

  return pair;
}

export async function getPairLiquidity(address: string, days: number) {
  const pair = await prisma.pair.findFirst({
    where: {
      address: address,
    }
  });

  const pairEntries = await prisma.pairHistory.findMany({
    where: {
      pairId: pair?.id,
      createdAt: {
        gte: Date.now() - days * 60 * 60 * 24 * 1000,
      },
    },
  });

  return serializeBigInt(pairEntries);
}

export async function getTokens() {
  const tokens = await prisma.token.findMany();

  return tokens;
}

export async function getToken(address: string) {
  const token = await prisma.token.findFirst({
    where: {
      address: address
    }
  });

  return token;
}

export async function deleteOldEntries() {
  const cutoffDate = Date.now() - 7 * 24 * 60 * 60 * 1000;

  try {
    // Delete entries from PairHistory
    const deletedPairHistory = await prisma.pairHistory.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    // Delete entries from TokenHistory
    const deletedTokenHistory = await prisma.tokenHistory.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return [deletedPairHistory, deletedTokenHistory];
  } catch (error) {
    console.error('Error deleting entries:', error);
  }
}

function serializeBigInt(arr: any) {
  const parsed = arr.map((pair: any) => {
    return JSON.parse(JSON.stringify(pair, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // 
    ));
  });

  return parsed
}
