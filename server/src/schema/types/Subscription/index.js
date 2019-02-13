import { pubsub, AUTHOR_CREATED, MESSAGE_CREATED, BOOK_CREATED } from '../utils';

export const Subscription =`
    type Subscription {
        authorCreated: Author
        messageCreated: Message
        bookCreated: Book
    }
`;

export const subscriptionResolvers = {
	authorCreated: {
		subscribe: () => pubsub.asyncIterator([AUTHOR_CREATED])
	},
	messageCreated: {
		subscribe: () => pubsub.asyncIterator([MESSAGE_CREATED]),
	},
	bookCreated: {
		subscribe: () => pubsub.asyncIterator([BOOK_CREATED]),
	},
};
