import gql from 'graphql-tag';

import { getUser, buildFilters } from '../utils';

export const Query = gql`
    type Query {
        allAuthors: [Author!]
        allBooks: [Book!]
        allPersons: [Person!]
        allStaff: [Staff!]!
        allUsers: [User!]
        authorById(_id: ID!): Author
        authorByName(name: String!): [Author]
        bookById(_id: ID!): Book
        books(skip: Int, limit: Int): [Book!]!
        me: User
        staffById(_id: ID!): Staff
    }
`;

export const queryResolvers = {
	allStaff: async(parent, _, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		const allStaff = await context.models.mongo.Staff.getAll(context);
		for (const staff of allStaff) {
			context.dataLoaders.mongo.staffLoader.prime(staff._id, staff);
		}
		return allStaff;
	},
	me: (parent, _, context) => {
		if(!context.authToken) return null;
		return getUser(context.authToken);
	},
	authorById: (parent, { _id }, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.Author.getById(_id, context);
	},
	authorByName: (parent, { name }, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.Author.getByName(name, context);
	},
	allAuthors: (parent, _, context, info) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.Author.getAll(context);
	},
	staffById: (parent, { _id }, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.Staff.getById(_id, context);
	},
	allBooks: (parent, _, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.Book.getAll(context);
	},
	bookById: (parent, { _id }, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.Book.getById(_id, context);
	},
	books: (root, { skip, limit }, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		const cursor = context.models.mongo.Book.getSample({skip,limit},context);
		return cursor.toArray();
	},
	allUsers: (parent, _, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		return context.models.mongo.User.getAll(context);
	},
	allPersons: async(parent, _, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return new Error('Not Authorizied');
		const [authors, allStaff] = await Promise.all([
			context.models.mongo.Author.getAll(context),
			context.models.mongo.Staff.getAll(context)
		]);
		for (const staff of allStaff) {
			context.dataLoaders.mongo.staffLoader.prime(staff._id, staff);
		}
		return authors.concat(allStaff);
	},/*
	messageSearch: (parent, args, context) => {
		const { filter, first, skip } = args;
		const where = filter
			? { $or : [{_id : {$regex : `${filter}`}}, {content : {$regex : `${filter}`}} ]}
			: {};
		return context.models.mongo.Message.search(where, context);
	},
	allMessages: (root, { filter, first, skip }, context) => {
		let query = filter ? {$or: buildFilters(filter)} : {};
		const cursor = context.models.mongo.Message.search(query, context);
		if (first) {
			cursor.limit(first);
		}
		if (skip) {
			cursor.skip(skip);
		}
		return cursor;
	},*/
};
