// tslint:disable:no-console
// tslint:disable:no-shadowed-variable
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
// import { createHttpLink } from 'apollo-link-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { clientConfig } from '../client-config';
import App from './components/App/';

const AUTH_TOKEN = 'auth-token';

const {
  server: { host, path, port }
} = clientConfig;

const loggerLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  operation.setContext({ start: new Date() });
  // to fix TS2722: !
  return forward!(operation).map(response => {
    // to fix TS2362: instead of +new Date(), new Date().getTime() also works
    const responseTime = +new Date() - operation.getContext().start;
    console.log(`GraphQL Response took: ${responseTime}`);
    return response;
  });
});

/*
const httpLink = createPersistedQueryLink().concat(
  createHttpLink({
    uri: `http://${host}:${port}${path}`
  })
);*/

/*
 * passing an options object like this createPersistedQueryLink({ useGETForHashedQueries: true }) enables persisted
 * queries but breaks fetchMore()
 * also see https://github.com/apollographql/apollo-link-persisted-queries/issues/33
 *
 * uri is for example 'http://loacalhost:4000/graphql' or 'http://192.168.99.100:4000/graphql'
 */
const httpLink = createPersistedQueryLink().concat(
  new BatchHttpLink({
    includeExtensions: true,
    uri: `http://${host}:${port}${path}`
  })
);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

// e.g. 'ws://loacalhost:4000/graphql' or 'ws://192.168.99.100:4000/graphql'
const subscriptionClient = new SubscriptionClient(
  `ws://${host}:${port}${path}`,
  {
    connectionCallback: error => {
      if (error) {
        console.log('connectionCallback ', error);
      }
    },
    connectionParams: () => ({
      authToken: localStorage.getItem(AUTH_TOKEN)
    }),
    lazy: true,
    reconnect: true,
    timeout: 30000
  }
);

// For now only interesting for development purposes
subscriptionClient.onConnecting(() =>
  console.log(`CONNECTING to ws://${host}:${port}${path}`)
);
subscriptionClient.onConnected(() =>
  console.log(`CONNECTED to ws://${host}:${port}${path}`)
);
subscriptionClient.onDisconnected(() =>
  console.log(`DISCONNECTED from ws://${host}:${port}${path}`)
);
subscriptionClient.onReconnected(() =>
  console.log(`RECONNECTED to ws://${host}:${port}${path}`)
);
subscriptionClient.onReconnecting(() =>
  console.log(`RECONNECTING to ws://${host}:${port}${path}`)
);
subscriptionClient.onError(e => console.log('ERROR ', e));

const wsLink = new WebSocketLink(subscriptionClient);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const retryIf = error => {
  const doNotRetryCodes = [500, 400];
  return !!error && !doNotRetryCodes.includes(error.statusCode);
};
const retryLink = new RetryLink({
  attempts: {
    max: 3,
    retryIf
  },
  delay: {
    initial: 100,
    jitter: true,
    max: 2000
  }
});

// Queries and Mutations are going to be handled by httpLink eventually, while wsLink takes care of Subscriptions
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  loggerLink
    .concat(retryLink)
    .concat(errorLink)
    .concat(wsLink),
  loggerLink
    .concat(authLink)
    .concat(retryLink)
    .concat(errorLink)
    .concat(httpLink)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

const Client = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);

export default Client;
