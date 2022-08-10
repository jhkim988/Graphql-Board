import { GraphQLScalarType } from 'graphql';

export default {
  User: {
    posted: async (parent, args, { db }) => {
      return await db.colletion('post').find({ userId: parent._id }).toArray();
    },
    commented: async (parent, args, { db }) => {
      return await db.collection('comment').find({ userId: parent._id }).toArray();
    },
    goodPost: async (parent, args, { db }) => {
      const findUser = await db.collection('user').findOne({ _id: parent._id });
      return await db.collection('post').find({ _id: { $in: findUser.goodPost }}).toArray();
    }
  },
  Post: {
    postedBy: async (parent, args, { db }) => {
      return await db.collection('user').findOne({ _id: parent.userId });
    },
    totalComments: async (parent, args, { db }) => {
      return await db.collection('comment').findAll({ postId: parent._id }).estimatedDocumentCount();
    },
    comments: async (parent, args, { db }) => {
      return await db.collection('comment').find({ postId: parent.id }).toArray();
    }
  },
  Comment: {
    of: async (parent, args, { db }) => {
      return await db.collection('post').findOne({ _id: postId });
    },
    commentedBy: async (parent, args, { db }) => {
      return await db.collection('user').findOne({ _id: userId });
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