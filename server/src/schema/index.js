import { makeExecutableSchema } from 'graphql-tools';

import { Author, authorResolvers } from './types/Author/index';
import { Book, bookResolvers } from './types/Book/index';
import { CustomDate, customDateResolvers } from './types/CustomDate/index';
import { Node, nodeResolvers} from './types/Node/index';
import { Person, personResolvers } from './types/Person/index';
import { Message } from './types/Message/index';
import { Mutation, mutationResolvers } from './types/Mutation/index';
import { Query, queryResolvers } from './types/Query/index';
import { Staff, staffResolvers } from './types/Staff/index';
import { Subscription, subscriptionResolvers } from './types/Subscription/index';
import { User } from './types/User/index';

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
