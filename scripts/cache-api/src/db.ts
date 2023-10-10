import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
      address: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
    },
  });

  const pair = await prisma.pair.create({
    data: {
      address: "paircontractaddress",
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

export async function getPair(id: number) {
  const pair = await prisma.pair.findUnique({
    where: {
      id: id,
    },
    include: {
      assetA: true,
      assetB: true,
      assetShare: true,
    }
  });

  return pair;
}

export async function getTokens() {
  const tokens = await prisma.token.findMany();

  return tokens;
}

export async function getToken(id: number) {
  const token = await prisma.token.findUnique({
    where: {
      id: id
    }
  });

  return token;
}
