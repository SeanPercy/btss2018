import { pubsub, MESSAGE_CREATED, BOOK_CREATED } from "../utils";

export const Subscription =`
    type Subscription {
        messageCreated: Message
        bookCreated: Book
    }
`;

export const subscriptionResolvers = {
	messageCreated: {
		subscribe: () => pubsub.asyncIterator([MESSAGE_CREATED]),
	},
	bookCreated: {
		subscribe: () => pubsub.asyncIterator([BOOK_CREATED]),
	},
};
