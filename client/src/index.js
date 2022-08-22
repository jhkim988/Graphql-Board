import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './main/App.js';
import reportWebVitals from './reportWebVitals';
import { InMemoryCache, ApolloLink, split, ApolloClient, ApolloProvider } from '@apollo/client';
import { persistCache } from 'apollo-cache-persist';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { createUploadLink } from 'apollo-upload-client';

const root = ReactDOM.createRoot(document.getElementById('root'));
const cache = new InMemoryCache();
persistCache({ cache, storage: localStorage });

if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist']);
  cache.restore(cacheData);
}

const httpLink = new createUploadLink({ uri: 'http://localhost:4000/graphql'});
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  options: { reconnect: true }
}));
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      login: localStorage.getItem('login'),
      logintype: localStorage.getItem('loginType'),
      authorization: localStorage.getItem('token')
    }
  }));
  return forward(operation);
})

const httpAuthLink = authLink.concat(httpLink);
const link = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription'
}, wsLink, httpAuthLink);

const client = new ApolloClient({ cache, link });

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
