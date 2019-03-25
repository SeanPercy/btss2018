import { MongoDBConnector } from '../connectors/index';
import { Author, Book, Staff, User } from '../models/mongo/index';
import buildMongoLoader from '../dataloaders/mongo/index';
import { getUser } from '../helpers/utils';

export function createContext({ req, mongodb }) {
  if (!req || !req.headers) {
    return undefined;
  }
  const token = req.headers.authorization || '';
  const user = getUser(token);

  // Name of the connector that gets passed to the models
  const mongo = 'mongo';

  return {
    authToken: token,
    connectors: {
      [mongo]: new MongoDBConnector(mongodb),
    },
    dataLoaders: {
      mongo: {
        authorLoader: buildMongoLoader({ db: mongodb, collection: 'authors' }),
        bookLoader: buildMongoLoader({ db: mongodb, collection: 'books' }),
        staffLoader: buildMongoLoader({ db: mongodb, collection: 'staff' }),
      },
    },
    models: {
      mongo: {
        Author: new Author({ db: mongo, collection: 'authors' }),
        Book: new Book({ db: mongo, collection: 'books' }),
        Staff: new Staff({ db: mongo, collection: 'staff' }),
        User: new User({ db: mongo, collection: 'users' }),
      },
    },
    user,
  };
}
