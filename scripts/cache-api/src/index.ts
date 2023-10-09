import "dotenv/config";
import * as fetch from "./fetch";
import typeDefs from "./typeDefs";
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server'

const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

fetch.startFetch();

const resolvers = {
  Query: {
    allUsers: () => {
      return prisma.token.findMany();
    }
  }
};

const server = new ApolloServer({ resolvers, typeDefs });
server.listen({ port: port });
