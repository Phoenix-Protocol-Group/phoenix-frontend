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

export async function getPair(address: string) {
  const pair = await prisma.pair.findUnique({
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
  const pairs = pairEntries.map((pair) => {
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
  const token = await prisma.token.findUnique({
    where: {
      address: address
    }
  });

  return token;
}


export async function mockData() {
  const tokenA = await prisma.token.create({
    data: {
      address: "CC5BDQ7J2VK4TQHHIMFNVMV5ZJZYDXDZN7XQ7IM73XKKPYF2KKARCOIW"
    },
  });

  const tokenB = await prisma.token.create({
    data: {
      address: "CC6HQVYSKVFCKWU6EKYDILHFOV5DC26VICEUYAMKTIDS4XZPYMDP3WOS"
    },
  });

  const tokenShare = await prisma.token.create({
    data: {
      address: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    },
  });

  const pair = await prisma.pair.create({
    data: {
      address: "paircontractaddress",
      timestamp: Date.now(),
      assetA: {
        connect: {
          id: tokenA.id,
        },
      },
      assetAAmount: 100,
      assetB: {
        connect: {
          id: tokenB.id,
        },
      },
      assetBAmount: 200,
      assetShare: {
        connect: {
          id: tokenShare.id,
        },
      },
      assetShareAmount: 300,
    },
  });
}
