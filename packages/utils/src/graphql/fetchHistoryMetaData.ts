import { gql } from "@apollo/client";
import { createApolloClient } from "./apolloClient";

const GET_ACCOUNT_DATA = gql`
  query GetAccountData {
    activeAccountsLast24h
    totalAccounts
  }
`;

export async function fetchHistoryMetaData() {
  const client = createApolloClient();

  try {
    const { data } = await client.query({
      query: GET_ACCOUNT_DATA,
    });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
