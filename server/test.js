import { ApolloServer } from 'apollo-server-express';
import { MongoClient } from 'mongodb';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { PubSub } from 'graphql-subscriptions';

import dotenv from 'dotenv';
import resolvers from './resolvers/index.js';

import { createUserTest, updateUserTest, deleteUserTest } from './testUnit/testUser.js'
import { createPostTest, updatePostTest, deletePostTest } from './testUnit/testPost.js';
import { createCommentTest, deleteCommentTest } from './testUnit/testComment.js';
import { addGoodTest, addBadTest } from './testUnit/testScore.js';

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_COLLECTION_NAME = process.env.DB_COLLECTION_NAME

const typeDefs = readFileSync('./typeDefs.graphql', 'utf-8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const client = await MongoClient.connect(DB_HOST, {useNewUrlParser: true});
const db = client.db(DB_COLLECTION_NAME);
const pubsub = new PubSub();

const makeUser = (login, loginType, name, avatar, token) => ({
  login, loginType, name, avatar, token
})
let userList = [0].map(x => makeUser(`login${x}`, `GITHUB`, `name${x}`, `avatar${x}`, `token${x}`));
let userInfo = [100].map(x => makeUser(`login${x}`, `GITHUB`, `name${x}`, `avatar${x}`, `token${x}`));

const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  context: async ({ req }) => {
    const currentUser = await db.collection('user').findOne({ $and: [
      { login: userList[0].login },
      { loginType: userList[0].loginType },
      { token: userList[0].token }
    ]});
    return { db, currentUser, pubsub }
  }
});

test('create user', createUserTest(server, userList[0]));
test('update user', updateUserTest(server, userList[0], userInfo[0]));

test('create post', createPostTest(server, { title: 'testTitle', content: 'testContent', photo: 'testPhoto' }));
test('update post', updatePostTest(server, { title: 'updateTitle', content: 'updateContent', photo: 'updatePhoto' }));
test('delete post', deletePostTest(server));

test('create comment', createCommentTest(server, userList[0]));
test('delete comment', deleteCommentTest(server));

test('good', addGoodTest(server));
test('bad', addBadTest(server));

test('delete user', deleteUserTest(server, userList[0]));