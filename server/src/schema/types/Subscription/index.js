import { gql } from 'apollo-server-express';

import { pubsub, AUTHOR_CREATED, AUTHOR_UPDATED, BOOK_CREATED } from '../utils';

export const Subscription = gql`
  type Subscription {
    authorCreated: Author
    authorUpdated: Author
    bookCreated: Book
  }
`;

export const subscriptionResolvers = {
  authorCreated: {
    subscribe: () => pubsub.asyncIterator([AUTHOR_CREATED]),
  },
  authorUpdated: {
    subscribe: () => pubsub.asyncIterator([AUTHOR_UPDATED]),
  },
  bookCreated: {
    subscribe: () => pubsub.asyncIterator([BOOK_CREATED]),
  },
};
