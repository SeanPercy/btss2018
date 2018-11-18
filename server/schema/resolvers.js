import { PubSub } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import { APP_SECRET, getUser } from '../utils';

const MESSAGE_CREATED = 'MESSAGE_CREATED';
const BOOK_CREATED = 'BOOK_CREATED';

const pubsub = new PubSub();

function buildFilters({OR = [], content_contains, info_contains}) {
	const filter = (content_contains || info_contains) ? {} : null;
	if (content_contains) {
		filter.content = {$regex: `.*${content_contains}.*`};
	}
	if (info_contains) {
		filter.info = {$regex: `.*${info_contains}.*`};
	}
	
	let filters = filter ? [filter] : [];
	for (let i = 0; i < OR.length; i++) {
		filters = filters.concat(buildFilters(OR[i]));
	}
	return filters;
}

export const resolvers = {
	Query: {
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
	},
	Mutation: {
		signup: async(parent, { credentials }, context) => {
			const { username, email, password, role } = credentials;
			const user = await context.models.mongo.User.create({
				username,
				email,
				password: await bcrypt.hash(password, 10),
				role,
			}, context);
			
			const token = jwt.sign(
				{
				  username: user.username,
				  email: user.email,
				  role: user.role
				},
				APP_SECRET,
				{ expiresIn: '1y' }
			);
			
			return { user, token };
		},
		login: async(parent, { credentials }, context) => {
			const user = await context.models.mongo.User.getByEmail(credentials.email, context);
			if (!user) {
				throw new Error('No user with that email');
			}
			
			const valid = await bcrypt.compare(credentials.password, user.password);
			
			if (!valid) {
				throw new Error('Incorrect password');
			}
			
			const token = jwt.sign(
				{
					_id: user._id,
					username: user.username,
					email: user.email,
					role: user.role
				},
				APP_SECRET,
				{ expiresIn: '1d' }
			);
			
			return { user, token };
		},
		addMessage: async(parent, { message }, context) => {
			pubsub.publish(MESSAGE_CREATED, { messageCreated: message });
			return await context.models.mongo.Message.addMessage(message, context);
		},/*
		addBook: async(parent, { book }, context) => {
			pubsub.publish(BOOK_CREATED, { bookCreated: book });
			return await context.models.mongo.Book.addBook(book, context);
		},*/
		deleteAllMessages: async(parent, _, context) => {
			return await context.models.mongo.Message.deleteAll(context);
		}
	},
	Subscription: {
		messageCreated: {
			subscribe: () => pubsub.asyncIterator([MESSAGE_CREATED]),
		},
		bookCreated: {
			subscribe: () => pubsub.asyncIterator([BOOK_CREATED]),
		},
	},
	Author: {
		books: async(author, _, context) => {
			return await context.dataLoaders.mongo.bookLoader.loadMany(author.books);
		},
		fullName: async(person, _, context) => {
			return `${person.firstName} ${person.lastName}`;
		},
	},
	Staff: {
		fullName: async(person, _, context) => {
			return `${person.firstName} ${person.lastName}`;
		},
		superior: async(staff, _, context) => {
			if(!staff.superior) return null;
			return await context.dataLoaders.mongo.staffLoader.load(staff.superior);
		},
		subordinates: async(staff, _, context) => {
			if(!staff.subordinates) return null;
			return await context.dataLoaders.mongo.staffLoader.loadMany(staff.subordinates);
		},
	},
	Book: {
		author: async(book, _, context) => {
			return await context.dataLoaders.mongo.authorLoader.load(book.author);
		},
		inSeconds: async(book, _, context) => {
			return book.releaseDate;
		},
	},
	Person: {
		__resolveType(obj, context, info){
			if(obj.books){
				return 'Author';
			}
			if(obj.department){
				return 'Staff';
			}
			return null;
		},
	},
	CustomDate: new GraphQLScalarType({
		name: 'CustomDate',
		description: 'Date custom scalar type',
		parseValue(value) {
			return new Date(value); // value from the client
		},
		serialize(value) {
			return value.getTime(); // value sent to the client
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return new Date(ast.value); // ast value is always in string format
			}
			return null;
		},
	}),
};