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

import cors from 'cors';
import expressPlayground from 'graphql-playground-middleware-express';
import dotenv from 'dotenv';
import resolvers from './resolvers/index.js';
import { createUser, updateUser, deleteAllUser } from './testUnit/testUser.js'

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME

const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app); // for web socket
const client = await MongoClient.connect(DB_HOST, {useNewUrlParser: true});
const db = client.db(DB_COLLECTION_NAME);
const pubsub = new PubSub();

// apollo server config:
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  context: async ({ req }) => {
    // http or websocket
    const token = req && req.headers.authorization;
    const login = token && req.headers.login;
    const loginType = token && req.headers.logintype;
    const currentUser = await db.collection('user').findOne({ $and: [{token}, {login} , {loginType}] })
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

const makeUser = (login, loginType, name, avatar, token) => ({
  login, loginType, name, avatar, token
})

const userList = [0].map(x => makeUser(`login${x}`, `GITHUB`, `name${x}`, `avatar${x}`, `token${x}`));
const userInfo = [100].map(x => makeUser(`login${x}`, `GITHUB`, `name${x}`, `avatar${x}`, `token${x}`));


test('create user', createUser(server, userList[0]));
test('update user', updateUser(server, userList[0], userInfo[0]));
test('delete all user', deleteAllUser(server));