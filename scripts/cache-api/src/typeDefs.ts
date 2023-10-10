const typeDefs = `
  type Token {
    address: String
  }

  type Pair {
    address: String
  }

  type Query {
    getPairs: [Pair!]!
    getPair(id: Int!): Pair

    getTokens: [Token!]!
    getToken(id: Int!): Token
  }
`;

export default typeDefs;
