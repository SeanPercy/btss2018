export const typeDefs =`
	type Book implements Node {
        _id: ID!
        title: String!
        author: Author
        genre: Genre
        releaseDate: Date
        inSeconds: CustomDate
    }
    enum Genre {
        COOKING
        PROGRAMMING
        NOVEL
    }
    type BookFeed {
	    cursor: String!
        books: [Book]!
    }
    input BookFilterInput {
	  OR: [BookFilterInput!]
	  title_contains: String
	  genre_contains: String
	}
`;

export const resolvers = {
	author: async(book, _, context) => {
		return await context.dataLoaders.mongo.authorLoader.load(book.author);
	},
		inSeconds: async(book, _, context) => {
		return book.releaseDate;
	}
};