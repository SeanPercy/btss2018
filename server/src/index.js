import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { MongoClient, Logger } from 'mongodb';

import config from './server-config';
import { seedDatabase } from './helpers/seedDatabase';
import { createContext } from './context';
import { executableSchema } from './schema';

(async () => {

	// CONNECT TO DATABASE
	const mongoDB = await MongoClient
		.connect(`mongodb://localhost:${config.db.port}`, // Without Docker, connect to 'mongodb://localhost:${config.db.port}
			{
				useNewUrlParser: true,
				authSource: config.db.name,
				auth: {
					user: config.auth.user,
					password: config.auth.password
				},
				authMechanism: config.authMechanism,
			})
		.then(client => {
			console.log('Connected correctly to database');
			Logger.setLevel('error');
			return client.db(config.db.name);
		})
		.catch((error) => {
			console.log(error);
		});

	// DATABASE SEEDING
	await seedDatabase(mongoDB)
		.then(success => console.log(success))
		.catch(e => console.log(e));

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
		// On Docker it should be 'http://192.168.99.100:4000/graphql/' Otherwise it is 'http://localhost:4000/graphql/'
		console.log(`🚀 Server ready at http://${config.server.host}:${config.server.port}${config.server.path}`)
	);
})();
