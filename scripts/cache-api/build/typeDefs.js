"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `
  type User {
    email: String!
    name: String
  }

  type Query {
    allUsers: [User!]!
  }
`;
exports.default = typeDefs;
