import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { MongoClient, Logger } from 'mongodb';

import { serverConfig } from './server-config';
import { seedDatabase } from './helpers/seedDatabase';
import { createContext } from './context';
import { executableSchema } from './schema';

(async () => {

	const { db : { mongo }, server } = serverConfig;

	/*
	* CONNECT TO DATABASE
	* On Docker, the connection string is 'mongodb://mongo:27017' ('mongo' refers to the container's name inside docker-compose.*.yml)
	* When connected to a local (non-Docker) instance of MongoDB it is 'mongodb://localhost:27017'
	*/
	const mongodb = await MongoClient
		.connect(`${mongo.host}:${mongo.port}`,
			{
				useNewUrlParser: true,
				authSource: mongo.name,
				auth: {
					user: mongo.auth.user,
					password: mongo.auth.password
				},
				authMechanism: mongo.authMechanism,
			})
		.then(client => {
			console.log('Connected correctly to database');
			Logger.setLevel('error');
			return client.db(mongo.name);
		})
		.catch((error) => {
			console.log(error);
		});

	// DATABASE SEEDING
	await seedDatabase(mongodb)
		.then(success => console.log(success))
		.catch(e => console.log(e));

	const apolloServer = new ApolloServer({
		schema: executableSchema,
		tracing: true,
		cacheControl: true,
		context: ({ req }) => createContext({ req, mongodb }),
	});
	
	const app =  express();
	apolloServer.applyMiddleware({ app, path: server.path });

	const httpServer = createServer(app);
	apolloServer.installSubscriptionHandlers(httpServer);

	/*
	* On Docker the GraphQL-Server is available on 'http://192.168.99.100:4000/graphql/'
	* Without Docker it is available on 'http://localhost:4000/graphql/'
	*/
	httpServer.listen({ port: server.port }, () =>
		console.log(`🚀 Server ready at http://${server.host}:${server.port}${server.path}`)
	);
})();
