import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { MongoClient, Logger } from 'mongodb';

//import config from '../config';
import { seedDatabase } from './helpers/seedDatabase';
import { createContext } from './context';
import { executableSchema } from './schema/';

(async () => {
	
	const mongoDB = await MongoClient
		.connect("mongodb://192.168.99.100:27017",{ useNewUrlParser: true })
		.then(client => {
			console.log('Connected correctly to database');
			Logger.setLevel('error');
			return client.db("btss2018");
		});

	await seedDatabase(mongoDB)
		.then(success => console.log(success));
	
	const server = new ApolloServer({
		schema: executableSchema,
		tracing: true,
		cacheControl: true,
		context: ({ req }) => createContext(req, mongoDB),
	});
	
	const app =  express();
	const httpServer = createServer(app);
	
	server.applyMiddleware({ app, path: '/graphql/' });
	server.installSubscriptionHandlers(httpServer);
	httpServer.listen({ port: 4005 }, () =>
		console.log(`🚀 Server ready at http://localhost:4005/graphql`)
	);
})();
