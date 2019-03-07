import gql from 'graphql-tag';

export const Book = gql`
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
	input BookInput {
        title: String!
        author: ID!
        genre: Genre!
	}
`;

export const bookResolvers = {
	author: (book, _, context) => {
		return context.dataLoaders.mongo.authorLoader.load(book.author);
	},
	inSeconds: (book) => {
		return book.releaseDate;
	}
};
