import { GraphQLScalarType } from "graphql";

export default {
  User: {
    posted: async (parent, args, { db }) => {
      return await db.colletion('post').find().filter(p => p.userId === parent.id);
    },
    commented: async (parent, args, { db }) => {
      return await db.collection('comment').find().filter(c => c.userId === parent.id);
    }
  },
  Post: {
    postedBy: async (parent, args, { db }) => {
      return await db.collection('user').findOne(u => u.id === parent.userId);
    },
    totalComments: async (parent, args, { db }) => {
      return await db.collection('comment').filter(c.postId === parent.id).estimatedDocumentCount();
    },
    comments: async (parent, args, { db }) => {
      return await db.collection('comment').filter(c => c.postId === parent.id);
    }
  },
  Comment: {
    of: async (parent, args, { db }) => {
      return await db.collection('post').findOne(p => p.id === parent.postId);
    },
    commentedBy: async (parent, args, { db }) => {
      return await db.collection('user').findOne(u => u.id === parent.userId);
    }
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => (new Date(value)).toISOString(),
    parseLiteral: ast => ast.value,
  })
}