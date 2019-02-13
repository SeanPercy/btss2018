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

import App from './components/App/App';

const AUTH_TOKEN = 'auth-token';

const httpLink = createPersistedQueryLink().concat(createHttpLink({
    uri: 'http://localhost:4000/graphql/'
}));

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    }
});

const subscriptionClient = new SubscriptionClient(
    'ws://localhost:4000/graphql', {
        connectionParams: () => ({
            authToken: localStorage.getItem(AUTH_TOKEN),
        }),
        lazy: true,
        reconnect: true,
        timeout: 30000,
    });
subscriptionClient.onConnecting(() => console.log('CONNECTING'));
subscriptionClient.onConnected(() => console.log('CONNECTED to ws://localhost:4000/graphql/'));
subscriptionClient.onDisconnected(() => console.log('DISCONNECTED from ws://localhost:4000/graphql/'));
subscriptionClient.onReconnected(() => console.log('RECONNECTED to ws://localhost:4000/graphql/'));
subscriptionClient.onReconnecting(()=> console.log('RECONNECTING to ws://localhost:4000/graphql/'));
subscriptionClient.onError((e)=> console.log('ERROR ',e) );

const wsLink = new WebSocketLink(subscriptionClient);

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
