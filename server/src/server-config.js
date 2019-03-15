const {
  APP_USER,
  APP_PASSWORD,
  APP_SECRET,
  AUTH_MECHANISM,
  MONGO_DATABASE,
  MONGO_DB_HOST,
  MONGO_DB_PORT,
  SERVER_HOST,
  SERVER_PATH,
  SERVER_PORT,
} = process.env;

/*
 * If the run with Docker, it takes care of setting environment variables.
 * The hardcoded values display the settings if the backend(GraphQL-Server + database(s)) is run without Docker.
 */
export const serverConfig = {
  db: {
    mongo: {
      auth: {
        password: APP_PASSWORD || 'app-password',
        user: APP_USER || 'app-user',
      },
      authMechanism: AUTH_MECHANISM || 'DEFAULT',
      host: MONGO_DB_HOST || 'mongodb://localhost', // Docker sets MONGO_DB_HOST to 'mongodb://mongo'
      name: MONGO_DATABASE || 'btss2018',
      port: MONGO_DB_PORT || '27017',
    },
  },
  jwt: {
    secret: APP_SECRET || 'my_secret',
  },
  server: {
    host: SERVER_HOST || 'localhost', // Docker sets SERVER_HOST to '192.168.99.100'
    path: SERVER_PATH || '/graphql',
    /* for subscriptions to work on clientside it is crucial that the value of
     * SERVER_PATH is '/graphql' and not '/graphql/' */
    port: SERVER_PORT || 4000,
  },
};
