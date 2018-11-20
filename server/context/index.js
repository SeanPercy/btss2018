import { MongoDBConnector } from '../connectors';
import { Author, Book, Staff, User, Message } from '../models/mongo/index';
import buildMongoLoader from '../dataloaders/mongo';

import { getUser } from "../utils";

export function createContext( req, mongoDB ) {
	if (!req || !req.headers) {
		return;
	}
	const token = req.headers.authorization || "";
	const user = getUser(token);
	
	return {
		connectors: {
			mongo: new MongoDBConnector(mongoDB),
		},
		models: {
			mongo : {
				Author: new Author({ db: 'mongo', collection: 'authors' }),
				Book: new Book({ db: 'mongo', collection: 'books'  }),
				Staff: new Staff({ db: 'mongo', collection: 'staff'  }),
				User: new User({ db: 'mongo', collection: 'users' }),
				Message: new Message({ db: 'mongo', collection: 'messages' }),
			},
		},
		dataLoaders: {
			mongo: {
				authorLoader: buildMongoLoader({ db: mongoDB, collection: 'authors' }),
				bookLoader: buildMongoLoader({ db: mongoDB, collection: 'books' }),
				staffLoader: buildMongoLoader({ db: mongoDB, collection: 'staff' })
			},
		},
		authToken: token,
		user,
	};
}
