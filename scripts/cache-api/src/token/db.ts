import prisma from "../prisma";

export async function getAll() {
  const tokens = await prisma.token.findMany();
  
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

export async function getBySymbol(symbol: string) {
  const token = await prisma.token.findFirst({
    where: {
      symbol: symbol
    }
  });

  return token;
}

export async function getOrCreate(address: string, { name, symbol, decimals }: { name: string, symbol: string, decimals: number }) {
  const token = await getByAddress(address);

  if(token !== null) return token;

  const newToken = await prisma.token.create({
    data: {
      address: address,
      name: name,
      symbol: symbol,
      decimals: decimals,
    },
  });

  return newToken;
}
