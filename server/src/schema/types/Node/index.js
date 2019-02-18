import gql from 'graphql-tag';

export const Node = gql`
    interface Node {
     _id: ID!
    }
`;

export const nodeResolvers = {
	__resolveType() {
		return null;
	}
};
