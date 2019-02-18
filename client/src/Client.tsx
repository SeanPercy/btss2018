import { InMemoryCache } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http';
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import React from "react";
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { clientConfig } from "../client-config";
import App from './components/App/';

const AUTH_TOKEN = 'auth-token';

const { server: { host, path, port } } = clientConfig;

// e.g. 'http://loacalhost:4000/graphql' or 'http://192.168.99.100:4000/graphql'
const httpLink =
    createPersistedQueryLink({ useGETForHashedQueries: true })
    .concat(createHttpLink({ uri: `http://${host}:${port}${path}` }));
// createPersistedQueryLink is reported to break refetchQueries in Mutations https://github.com/apollographql/apollo-link-persisted-queries/issues/33

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
});

// e.g. 'ws://loacalhost:4000/graphql' or 'ws://192.168.99.100:4000/graphql'
const subscriptionClient = new SubscriptionClient(
    `ws://${host}:${port}${path}`, {
        connectionCallback: (error) => console.log('connectionCallback ', error),
        connectionParams: () => ({
            authToken: localStorage.getItem(AUTH_TOKEN),
        }),
        lazy: true,
        reconnect: true,
        timeout: 30000,
    });

//For now only interesting for development purposes
subscriptionClient.onConnecting(() => console.log(`CONNECTING to ws://${host}:${port}${path}`));
subscriptionClient.onConnected(() => console.log(`CONNECTED to ws://${host}:${port}${path}`));
subscriptionClient.onDisconnected(() => console.log(`DISCONNECTED from ws://${host}:${port}${path}`));
subscriptionClient.onReconnected(() => console.log(`RECONNECTED to ws://${host}:${port}${path}`));
subscriptionClient.onReconnecting(()=> console.log(`RECONNECTING to ws://${host}:${port}${path}`));
subscriptionClient.onError((e)=> console.log('ERROR ',e) );


const wsLink = new WebSocketLink(subscriptionClient);

// Queries and Mutations are going to be handled by httpLink eventually, while wsLink takes care of Subscriptions
const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink),
);


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});


const Client =  () => 	(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>);

export default Client;
