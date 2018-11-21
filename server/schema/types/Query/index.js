import { getUser, buildFilters } from "../utils";

export const typeDefs =`
    type Query {
        allAuthors: [Author!]
        allBooks: [Book!]
        allMessages(filter: MessageFilterInput, skip: Int, first: Int): [Message!]!
        allPersons: [Person!]
        allStaff: [Staff!]!
        allUsers: [User!]
        authorById(_id: ID!): Author
        authorByName(name: String!): [Author]
        bookById(_id: ID!): Book
        books(filter: BookFilterInput, skip: Int, first: Int): [Book!]!
        bookFeed(cursor: String): BookFeed
        me: User
        messages: [Message!]
        messageSearch(filter: String!): [Message!]
        messageFeed(cursor: String): MessageFeed
        staffById(_id: ID!): Staff
    }
`;

export const resolvers = {
	allStaff: async(parent, _ , context) => {
		const allStaff = await context.models.mongo.Staff.getAll(context);
		for (const staff of allStaff) {
			context.dataLoaders.mongo.staffLoader.prime(staff._id, staff);
		}
		return allStaff;
	},
	me: async(parent, _, context) => {
		if(!context.authToken) return null;
		return getUser(context.authToken);
	},
	authorById: async(parent, {_id}, context) => {
		return await context.models.mongo.Author.getById(_id, context);
	},
	authorByName: async(parent, {name} , context) => {
		return await context.models.mongo.Author.getByName(name, context);
	},
	allAuthors: async(parent, _ , context) => {
		return await context.models.mongo.Author.getAll(context);
	},
	staffById: async(parent, {_id}, context) => {
		return await context.models.mongo.Staff.getById(_id, context);
	},
	allBooks: async(parent, _ , context) => {
		return await context.models.mongo.Book.getAll(context);
	},
	bookById: async(parent, {_id}, context) => {
		return await context.models.mongo.Book.getById(_id, context);
	},
	books: async (root, {filter, first, skip}, context) => {
		let query = filter ? {$or: buildFilters(filter)} : {};
		const cursor = context.models.mongo.Book.search(query, context);
		if (first) {
			cursor.limit(first);
		}
		if (skip) {
			cursor.skip(skip);
		}
		return cursor;
	},
	bookFeed: async(parent, {cursor}, context) =>{
	
	
	},
	messages: async(parent, _ , context) => {
		if (!context.user) return null;
		return await context.models.mongo.Message.getAll(context);
	},
	allUsers: async(parent, _, context) => {
		if (!context.user || !context.user.role === 'ADMIN') return null;
		return await context.models.mongo.User.getAll(context);
	},
	messageSearch: async(parent, args , context) => {
		const { filter, first, skip } = args;
		const where = filter
			? { $or : [{_id : {$regex : `${filter}`}}, {content : {$regex : `${filter}`}} ]}
			: {};
		return await context.models.mongo.Message.search(where, context);
	},
	allPersons: async(parent, _ , context) => {
		const authors = await context.models.mongo.Author.getAll(context);
		const allStaff = await context.models.mongo.Staff.getAll(context);
		for (const staff of allStaff) {
			context.dataLoaders.mongo.staffLoader.prime(staff._id, staff);
		}
		return authors.concat(allStaff);
	},/*
		allMessages: async (root, {filter}, context) => {
			let query = filter ? {$or: buildFilters(filter)} : {};
			return context.models.mongo.Message.search(query, context);
		},*/
	allMessages: async (root, {filter, first, skip}, context) => {
		let query = filter ? {$or: buildFilters(filter)} : {};
		const cursor = context.models.mongo.Message.search(query, context);
		if (first) {
			cursor.limit(first);
		}
		if (skip) {
			cursor.skip(skip);
		}
		return cursor;
	},
};