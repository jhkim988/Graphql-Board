import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';
import { MongoClient } from 'mongodb';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import path from 'path';
import { readFileSync } from 'fs';
import { createServer } from 'http';
import { PubSub } from 'graphql-subscriptions';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import expressPlayground from 'graphql-playground-middleware-express';
import dotenv from 'dotenv';
import resolvers from './resolvers/index.js';

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_DATABASE_NAME = process.env.DB_DATABASE_NAME

const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const start = async() => {
  const app = express();
  const httpServer = createServer(app); // for web socket
  const client = await MongoClient.connect(DB_HOST, {useNewUrlParser: true});
  const db = client.db(DB_DATABASE_NAME);
  const pubsub = new PubSub();

  // apollo server config:
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cors: { origin: ["http://localhost:3000"]},
    context: async ({ req, connection }) => {
      // http or websocket
      const token = req ? req.headers.authorization: connection.context.Authorization;
      const login = token && req.headers.login;
      const loginType = token && req.headers.logintype;
      const currentUser = await db.collection('user').findOne({ $and: [{token}, {login}, {loginType}] })
      return { db, currentUser, pubsub }
    },
    plugins: [
      // shutdown http server
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        // shutdown websocket server
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          }
        }
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ]
  });
  await server.start();

  // Route:
  app.use('/img/photos', express.static(path.join(path.resolve(), 'assets', 'photos')));
  app.use(graphqlUploadExpress());
  app.get('/', (req, res) => {

  });
  app.get('/playground', expressPlayground.default({ endpoint: '/graphql'}));
  server.applyMiddleware({ app });

  // web socet config:
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });
  const serverCleanup = useServer({
    schema,
    context: async (ctx, msg, args) => {
      // to do: Identify Login Type
      const token = ctx.Authorization;
      const login = ctx.login;
      const loginType = ctx.loginType;
      const currentUser = await db.collection('user').findOne({ $and: [{login}, {loginType}, {token}] });
      return { pubsub, db, currentUser };
    }
  }, wsServer);

  httpServer.timeout= 5000;
  httpServer.listen({ port: 4000 }, () => console.log(`GraphQL Server running at localhost:4000${server.graphqlPath}`));
}
start();