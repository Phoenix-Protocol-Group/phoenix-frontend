import "dotenv/config";
import * as fetch from "./fetch";
import typeDefs from "./typeDefs";
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server'

const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

fetch.startFetch();

async function mockData() {
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

  const pairTokenA = await prisma.pairToken.create({
    data: {
      amount: 10000,
      token: {
        connect: {
          id: tokenA.id,
        },
      },
    },
  });

  const pairTokenB = await prisma.pairToken.create({
    data: {
      amount: 10000,
      token: {
        connect: {
          id: tokenB.id,
        },
      },
    },
  });

  const pairTokenShare = await prisma.pairToken.create({
    data: {
      amount: 10000,
      token: {
        connect: {
          id: tokenShare.id,
        },
      },
    },
  });

  const pair = await prisma.pair.create({
    data: {
      address: "paircontractaddress",
      assetA: {
        connect: {
          id: pairTokenA.id,
        },
      },
      assetB: {
        connect: {
          id: pairTokenB.id,
        },
      },
      assetShare: {
        connect: {
          id: pairTokenShare.id,
        },
      }
    },
  });

  const pairs = await prisma.pair.findMany();
  console.log(pairs);
}

//mockData();

const resolvers = {
  Query: {
    getPairs: prisma.pair.findMany(),
  }
};

const server = new ApolloServer({ resolvers, typeDefs });
server.listen({ port: port });
