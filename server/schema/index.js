import { makeExecutableSchema } from 'graphql-tools';

import { Author, authorResolvers } from './types/Author';
import { Book, bookResolvers } from './types/Book';
import { CustomDate, customDateResolvers } from './types/CustomDate';
import { Node, nodeResolvers} from './types/Node';
import { Person, personResolvers } from './types/Person';
import { Message } from './types/Message';
import { Mutation, mutationResolvers } from './types/Mutation';
import { Query, queryResolvers } from './types/Query';
import { Staff, staffResolvers } from './types/Staff';
import { Subscription, subscriptionResolvers } from './types/Subscription';
import { User } from './types/User';

export const executableSchema = makeExecutableSchema({
	typeDefs: [Query, Mutation, Subscription, Author, Book, CustomDate, Node, Person, Message, Staff, User],
	resolvers: {
		Query: {...queryResolvers},
		Mutation: {...mutationResolvers},
		Subscription: {...subscriptionResolvers},
		Author: {...authorResolvers},
		Book: {...bookResolvers},
		CustomDate: {...customDateResolvers},
		Node: {...nodeResolvers},
		Person: {...personResolvers},
		Staff: {...staffResolvers},
	},
	logger: {
		log: e => console.log(e),
	},
	allowUndefinedInResolve: true, // true by default
	resolverValidationOptions: {
		requireResolversForResolveType: false, // true by default
		requireResolversForAllFields: false, // false by default
		requireResolversForNonScalar: false, // false by default
		requireResolversForArgs: false, // false by default
		allowResolversNotInSchema: false, // false by default
	},
	//inheritResolversFromInterfaces: true,
});
