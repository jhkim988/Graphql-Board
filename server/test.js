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
import { createPost, updatePost } from './testUnit/testPost.js';

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

const makeUser = (login, loginType, name, avatar, token) => ({
  login, loginType, name, avatar, token
})
const userList = [0].map(x => makeUser(`login${x}`, `GITHUB`, `name${x}`, `avatar${x}`, `token${x}`));
const userInfo = [100].map(x => makeUser(`login${x}`, `GITHUB`, `name${x}`, `avatar${x}`, `token${x}`));

const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  context: async ({ req }) => {
    // http or websocket
    const token = userList[0].token;
    const login = userList[0].login;
    const loginType = userList[0].loginType;
    const currentUser = await db.collection('user').findOne({ $and: [{token}, {login} , {loginType}] })
    return { db, currentUser, pubsub }
  }
});

test('create user', createUser(server, userList[0]));
test('update user', updateUser(server, userList[0], userInfo[0]));

test('create post', createPost(server, { title: 'testTitle', content: 'testContent', photo: 'testPhoto' }));
test('update post', updatePost(server, { title: 'updateTitle', content: 'updateContent', photo: 'updatePhoto' }));

// test('delete all post')
test('delete all user', deleteAllUser(server));