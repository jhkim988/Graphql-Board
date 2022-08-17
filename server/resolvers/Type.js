import { GraphQLScalarType } from 'graphql';
import GraphQLUpload  from 'graphql-upload/GraphQLUpload.mjs';
import { ObjectId } from 'mongodb';
import { NoPost, NoUser } from './errorMessage.js';

export default {
  User: {
    posted: async (parent, args, { db }) => {
      return await db.collection('post').find({ userId: parent._id }).toArray();
    },
    commented: async (parent, args, { db }) => {
      return await db.collection('comment').find({ userId: parent._id }).toArray();
    },
    goodPost: async (parent, args, { db }) => {
      return await db.collection('post').find({ goodBy: { $elemMatch: { _id: parent._id }}}).toArray();
    },
    badPost: async (parent, args, { db }) => {
      return await db.collection('post').find({ badBy: { $elemMatch: { _id: parent._id }}}).toArray();
    }
  },
  Post: {
    postedBy: async (parent, args, { db }) => {
      return await db.collection('user').findOne({ _id: parent.userId });
    },
    totalComments: async (parent, args, { db }) => {
      return await db.collection('comment').find({ postId: parent._id }).estimatedDocumentCount();
    },
    comments: async (parent, args, { db }) => {
      return await db.collection('comment').find({ postId: parent._id }).toArray();
    }
  },
  Comment: {
    commentedOn: async (parent, args, { db }) => {
      const _id = new ObjectId(parent.postId);
      const findPost = await db.collection('post').findOne({ _id });
      if (!findPost) {
        throw NoPost;
      }
      return findPost;
    },
    commentedBy: async (parent, args, { db }) => {
      const _id = new ObjectId(parent.userId);
      const findUser = await db.collection('user').findOne({ _id });
      if (!findUser) {
        throw NoUser;
      }
      return findUser;
    }
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => (new Date(value)).toISOString(),
    parseLiteral: ast => ast.value,
  }),
  Upload: GraphQLUpload,
}