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

  return pairs;
}

export async function createPair(pair: any) {
  const newPair = await prisma.pair.create({
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
  const pair = await prisma.pair.findMany({
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
  const pairEntries = await prisma.pair.findMany({
    where: {
      address: address,
      timestamp: {
        gte: Date.now() - days * 60 * 60 * 24 * 1000,
      },
    },
  });

  //fix bigint json serialization problem
  const pairs = pairEntries.map((pair: any) => {
    return JSON.parse(JSON.stringify(pair, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // 
    ));
  });

  return pairs;
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
