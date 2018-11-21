export const typeDefs =`
    type Author implements Node & Person {
        _id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
        age: Int!
        sex: Sex!
        retired: Boolean!
        books: [Book!]
    }
`;

export const resolvers = {
	books: async(author, _, context) => {
		return await context.dataLoaders.mongo.bookLoader.loadMany(author.books);
	},
	fullName: async(person, _, context) => {
		return `${person.firstName} ${person.lastName}`;
	},
};