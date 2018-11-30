export const Author =`
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

export const authorResolvers = {
	books: (author, _, context) => {
		return context.dataLoaders.mongo.bookLoader.loadMany(author.books);
	},
	fullName: (person, _, context) => {
		return `${person.firstName} ${person.lastName}`;
	},
};
