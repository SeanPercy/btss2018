export const Book =`
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

export const bookResolvers = {
	author: (book, _, context) => {
		return context.dataLoaders.mongo.authorLoader.load(book.author);
	},
		inSeconds: (book, _, context) => {
		return book.releaseDate;
	}
};
