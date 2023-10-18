import prisma from "../prisma";

export async function getAll() {
  const tokens = await prisma.token.findMany();
  
  return tokens;
}

export async function getAllExceptShared() {
  const tokens = await prisma.token.findMany({
    where: {
      isSharedToken: false,
    }
  });

  return tokens;
}

export async function getByAddress(address: string) {
  const token = await prisma.token.findFirst({
    where: {
      address: address
    }
  });

  return token;
}

export async function getOrCreate(address: string, isSharedToken: boolean) {
  const token = await getByAddress(address);

  if(token !== null) return token;

  const newToken = await prisma.token.create({
    data: {
      address: address,
      isSharedToken: isSharedToken,
    },
  });

  return newToken;
}
