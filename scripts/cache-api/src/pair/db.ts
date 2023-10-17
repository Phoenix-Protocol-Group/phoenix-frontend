import prisma from "../prisma";

export async function getAll() {
  const pairs = await prisma.pair.findMany({
    include: {
      assetA: true,
      assetB: true,
      assetShare: true,
    }
  });

  return pairs;
}

export async function getByAddress(address: string) {
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

export async function create(pair: any) {
  const newPair = await prisma.pair.create({
    data: pair,
  });

  return newPair;
}
