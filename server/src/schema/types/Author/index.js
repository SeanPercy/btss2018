import gql from 'graphql-tag';

export const Author = gql`
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
    input AuthorInput {
       firstName: String!
       lastName: String!
       age: Int!
       sex: Sex!
       retired: Boolean!
    }
	input AuthorUpdateInput {
		_id: ID!,
        firstName: String
        lastName: String
        fullName: String
        age: Int
        sex: Sex
        retired: Boolean
	}
`;

export const authorResolvers = {
	books: (author, _, context) => {
		return context.dataLoaders.mongo.bookLoader.loadMany(author.books);
	},
	fullName: (person) => {
		return `${person.firstName} ${person.lastName}`;
	},
};
