import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { PHOENIX_HISTORY_INDEXER } from "../constants";

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: PHOENIX_HISTORY_INDEXER, // Replace with your GraphQL server URL
      fetch,
    }),
    cache: new InMemoryCache(),
  });
}
