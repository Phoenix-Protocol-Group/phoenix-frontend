import "dotenv/config";
import * as fetch from "./fetch";
import * as db from "./db"
import typeDefs from "./typeDefs";
import { ApolloServer } from 'apollo-server'

const port = process.env.PORT || 3000;

fetch.startFetch();

db.mockData();

db.getTokens().then((pairs) => {
  console.log(pairs);
});

const resolvers = {
  Query: {
    getPairs: () => db.getPairs(),
    getPair: (id: number) => db.getPair(id),
    getTokens: () => db.getTokens(),
    getToken: (id: number) => db.getToken(id),
  }
};

const server = new ApolloServer({ resolvers, typeDefs });
server.listen({ port: port });
