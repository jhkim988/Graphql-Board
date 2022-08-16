import { ObjectId } from "mongodb"

export default {
  totalUsers: async (parent, args, { db }) => {
    return await db.collection('user').estimatedDocumentCount()
  },
  allUsers: async (parent, args, { db }) => {
    return await db.collection('user').find().toArray()
  },
  userById: async (parent, { userId }, { db }) => {
    const objectId = new ObjectId(userId);
    return await db.collection('user').findOne({ _id: objectId });
  },
  userByLoginInfo: async(parent, { userLoginInfo }, { db }) => {
    return await db.collection('user').findOne({ $and: [
      { login: userLoginInfo.login },
      { loginType: userLoginInfo.loginType },
      { token: userLoginInfo.token }
    ]});
  },
  totalPosts: async (parent, args, { db }) => {
    return await db.collection('post').estimatedDocumentCount()
  },
  allPosts: async (parent, {cursor, limit}, { db }) => {
    if (!cursor) return await db.collection('post').find().toArray();
    return await db.collection('post').find(p => p.created < cursor).sort({ created: -1 }).limit(limit).toArray();
  },
  post: async (parent, { postId }, { db }) => {
    const _id = new ObjectId(postId);
    return await db.collection('post').findOne({ _id });
  },
  totalComments: async (parent, { postId }, { db }) => {
    return await db.collection('comment').find({ postId }).estimatedDocumentCount();
  },
  allComments: async (parent, { postId }, { db }) => {
    return await db.collection('comment').find({ postId }).toArray();
  },
  comment: async (parent, { commentId }, { db }) => {
    return await db.collection('comemnt').findOne({ _id: commentId });
  },
  me: async (parent, args, { currentUser }) => {
    return currentUser;
  }
}

