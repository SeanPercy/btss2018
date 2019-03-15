const {
  APP_SECRET,
  DEV_HOST,
  DEV_PORT,
  SERVER_HOST,
  SERVER_PATH,
  SERVER_PORT,
  TEST_PORT,
} = process.env;

/*
 * If run with Docker, it takes care of setting environment variables.
 * The hardcoded values display the settings if the backend(GraphQL-Server + database(s)) is run without Docker.
 */
export const clientConfig = {
  dev: {
    host: DEV_HOST || 'localhost',
    port: +DEV_PORT || 8080, // type coercion of DEV_PORT to number
  },
  jwt: {
    secret: APP_SECRET || 'my_secret',
  },
  server: {
    host: SERVER_HOST || 'localhost', // Docker sets SERVER_HOST to '192.168.99.100'
    path: SERVER_PATH || '/graphql',
    /* for subscriptions to work it is crucial that the value of path is '/graphql' and not '/graphql/' */
    port: SERVER_PORT || 4000,
  },
  test: {
    port: TEST_PORT || 4004,
  },
};
