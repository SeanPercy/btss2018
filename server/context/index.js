import { MongoDBConnector }from '../connectors';
import { Author, Book, Staff, User, Message } from '../models/mongo/index';
import { AuthorLoader } from '../dataloaders/mongo';
import { getUser } from "../utils";
import config from "../../config";
import mongo from "then-mongo/index";

export async function createContext( req, mongoDB ) {
	if (!req || !req.headers) {
		return;
	}
	const token = req.headers.authorization || "";
	const user = getUser(token);
	const Authors = await mongoDB.collection('authors');
	
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
		dataloaders: {
			authorLoader: AuthorLoader(Authors),
		},
		authToken: token,
		user,
	};
};