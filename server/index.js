import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { MongoClient, Logger } from 'mongodb';

import config from '../config';
import fillDataBase from './helpers/fillDatabase';
import { createContext } from './context';
import { executableSchema } from './schema/';

(async () => {
	
	const mongoDB = await MongoClient
		.connect(config.database.uri,{ useNewUrlParser: true })
		.then(client => {
			console.log('Connected correctly to database');
			Logger.setLevel('error');
			return client.db(config.database.uri);
		});

	await fillDataBase(mongoDB);
	
	const server = new ApolloServer({
		schema: executableSchema,
		tracing: true,
		cacheControl: true,
		context: ({ req }) => createContext(req, mongoDB),
	});
	
	const app =  express();
	const httpServer = createServer(app);
	
	server.applyMiddleware({ app, path: config.server.path });
	server.installSubscriptionHandlers(httpServer);
	httpServer.listen({ port: config.server.port }, () =>
		console.log(`🚀 Server ready at http://localhost:${config.server.port}${server.graphqlPath}`)
	);
})();
