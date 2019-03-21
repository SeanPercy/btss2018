// tslint:disable:no-console
// tslint:disable:no-shadowed-variable
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import App from 'components/App/';
import { AUTH_TOKEN, dataIdFromObject } from 'helpers';
import { clientConfig } from '../client-config';

const {
  server: { host, path, port }
} = clientConfig;

/*
 * Logs GraphQl requests being made and the time it takes to process them to the console
 */
const loggerLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  operation.setContext({ start: new Date() });
  // to fix TS2722: !
  return forward!(operation).map(response => {
    // to fix TS2362: instead of +new Date(), new Date().getTime() also works
    const responseTime = +new Date() - operation.getContext().start;
    console.log(`GraphQL Response took: ${responseTime} milliseconds`);
    return response;
  });
});

/*
 * Takes care of setting authorization headers for requests
 */
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

/*
 * If an error occurs, this Link decides under which circumstances und how exactly
 * the corresponding request should be re-executed
 */
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

/*
 * Logs graphQLErrors and networkErrors to the console
 */
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

/*
 * The SubscriptionClient is mainly needed for authentication.
 * It will be wrapped by a WebSocketLink eventually, which will take care of sending
 * and receiving Subscriptions via TCP, as specified in the options object below.
 *
 * 'ws://loacalhost:4000/graphql' or 'ws://192.168.99.100:4000/graphql'
 */
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
/*
 * For now, the callbacks below are only interesting for development purposes
 */
const wsLinkPath = `ws://${host}:${port}${path}`;
subscriptionClient.onConnecting(() =>
  console.log(`CONNECTING to ${wsLinkPath}`)
);
subscriptionClient.onConnected(() => console.log(`CONNECTED to ${wsLinkPath}`));
subscriptionClient.onDisconnected(() =>
  console.log(`DISCONNECTED from ${wsLinkPath}`)
);
subscriptionClient.onReconnected(() =>
  console.log(`RECONNECTED to ${wsLinkPath}`)
);
subscriptionClient.onReconnecting(() =>
  console.log(`RECONNECTING to ${wsLinkPath}`)
);
subscriptionClient.onError(e => console.log('ERROR ', e));

/*
 * A Link that wraps the Subscription Client
 */
const wsLink = new WebSocketLink(subscriptionClient);

/*
 * Optimistically sends a generated ID instead of the query text as the request, therefore reducing
 * the size of the request
 *
 * NOTE: passing { useGETForHashedQueries: true } as options object to createPersistedQueryLink doesn't work
 * in combination with BatchHttpLink. It does work in combination with apollo-http-link but then it
 * breaks fetchMore() calls
 * also see https://github.com/apollographql/apollo-link-persisted-queries/issues/33
 */
const persistQueryLink = createPersistedQueryLink();

/*
 * Emits HTTP requests for queries and mutations. If multiple being made at once it batches them
 * into one HTTP request
 *
 * uri is for example 'http://loacalhost:4000/graphql' or 'http://192.168.99.100:4000/graphql'
 */
const httpLink = new BatchHttpLink({
  includeExtensions: true,
  uri: `http://${host}:${port}${path}`
});

/*
 * Checks whether the GraphQL operation is a Query/Mutation or a Subscription
 * Queries and Mutations are going to be handled by httpLink-chain,
 * while the wsLink-chain takes care of Subscriptions
 */
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  // prettier-ignore
  ApolloLink.from([
    loggerLink,
    retryLink,
    errorLink,
    wsLink
  ]),
  ApolloLink.from([
    loggerLink,
    authLink,
    retryLink,
    errorLink,
    persistQueryLink,
    httpLink
  ])
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject
  }),
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
