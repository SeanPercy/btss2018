import { MongoDBConnector } from '../connectors/index';
import { Author, Book, Staff, User } from '../models/mongo/index';
import buildMongoLoader from '../dataloaders/mongo/index';
import { getUser } from '../helpers/utils';

export function createContext({ req, mongodb }) {
	if (!req || !req.headers) {
		return;
	}
	const token = req.headers.authorization || '';
	const user = getUser(token);

	// Name of the connector that gets passed to the models
	const mongo = 'mongo';

	return {
		connectors: {
			[mongo]: new MongoDBConnector(mongodb),
		},
		models: {
			mongo : {
				Author: new Author({ db: mongo, collection: 'authors' }),
				Book: new Book({ db: mongo, collection: 'books'  }),
				Staff: new Staff({ db: mongo, collection: 'staff'  }),
				User: new User({ db: mongo, collection: 'users' }),
			},
		},
		dataLoaders: {
			mongo: {
				authorLoader: buildMongoLoader({ db: mongodb, collection: 'authors' }),
				bookLoader: buildMongoLoader({ db: mongodb, collection: 'books' }),
				staffLoader: buildMongoLoader({ db: mongodb, collection: 'staff' })
			},
		},
		authToken: token,
		user,
	};
}
