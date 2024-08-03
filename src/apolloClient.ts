// src/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
const GRAPHQL_API_URL = `${process.env.REACT_APP_API_URL}/graphql`;
const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_API_URL as string,
  }),
  cache: new InMemoryCache(),
});

export default client;
