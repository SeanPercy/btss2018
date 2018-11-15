import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import mongo from 'then-mongo';

import config from '../config';
import { createContext} from './context';
import { executableSchema } from './schema';


(async () => {
	
	const mongoDB = await mongo(config.database.uri);
	
	const server = new ApolloServer({
		schema: executableSchema,
		tracing: true,
		cacheControl: true,
		context: async({ req }) => createContext(req, mongoDB),
	});
	
	const app =  express();
	server.applyMiddleware({ app, path: '/graphql/' });
    
	const httpServer = createServer(app);
	server.installSubscriptionHandlers(httpServer);
	httpServer.listen({ port: 5001 }, () =>
		console.log(`🚀 Server ready at http://localhost:${config.server.port}${server.graphqlPath}`)
	);
})();
