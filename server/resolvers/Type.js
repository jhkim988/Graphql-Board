import { GraphQLScalarType } from 'graphql';

export default {
  User: {
    posted: async (parent, args, { db }) => {
      return await db.colletion('post').find(p => p.userId === parent.id);
    },
    commented: async (parent, args, { db }) => {
      return await db.collection('comment').find(c => c.userId === parent.id);
    }
  },
  Post: {
    postedBy: async (parent, args, { db }) => {
      return await db.collection('user').findOne(u => u.id === parent.userId);
    },
    totalComments: async (parent, args, { db }) => {
      return await db.collection('comment').findAll(c.postId === parent.id).estimatedDocumentCount();
    },
    comments: async (parent, args, { db }) => {
      return await db.collection('comment').find({ postId: parent.id }).toArray();
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