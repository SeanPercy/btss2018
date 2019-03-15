import { gql } from 'apollo-server-express';

export const Node = gql`
  interface Node {
    _id: ID!
  }
`;

export const nodeResolvers = {
  __resolveType() {
    return null;
  },
};
