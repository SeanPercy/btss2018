export const Node =`
    interface Node {
     _id: ID!
    }
`;

export const nodeResolvers = {
	__resolveType() {
		return null;
	}
};
