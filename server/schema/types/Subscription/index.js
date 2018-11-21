import { pubsub, MESSAGE_CREATED, BOOK_CREATED } from "../utils";

export const typeDefs =`
    type Subscription {
        messageCreated: Message
        bookCreated: Book
    }
`;

export const resolvers = {
	messageCreated: {
		subscribe: () => pubsub.asyncIterator([MESSAGE_CREATED]),
	},
	bookCreated: {
		subscribe: () => pubsub.asyncIterator([BOOK_CREATED]),
	},
};