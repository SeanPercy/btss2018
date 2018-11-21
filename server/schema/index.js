import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs as Author, resolvers as authorResolvers }             from './types/Author';
import { typeDefs as Book, resolvers as bookResolvers }                 from './types/Book';
import { typeDefs as CustomDate, resolvers as customDateResolvers }     from './types/CustomDate';
import { typeDefs as Node }                                             from './types/I_Node';
import { typeDefs as Person, resolvers as personResolvers }             from './types/I_Person';
import { typeDefs as Message, resolvers as messageResolvers }           from './types/Message';
import { typeDefs as Mutation, resolvers as mutationResolvers }         from './types/Mutation';
import { typeDefs as Query, resolvers as queryResolvers }               from './types/Query';
import { typeDefs as Staff, resolvers as staffResolvers }               from './types/Staff';
import { typeDefs as Subscription, resolvers as subscriptionResolvers } from './types/Subscription';
import { typeDefs as User }                                             from './types/User';


export const executableSchema = makeExecutableSchema({
	typeDefs: [Query, Mutation, Subscription, Author, Book, CustomDate, Node, Person, Message, Staff, User],
	resolvers: {
		Query: {...queryResolvers},
		Mutation: {...mutationResolvers},
		Subscription: {...subscriptionResolvers},
		Author: {...authorResolvers},
		Book: {...bookResolvers},
		CustomDate: {...customDateResolvers},
		Person: {...personResolvers},
		Message: {...messageResolvers},
		Staff: {...staffResolvers},
	}
});
