import { ObjectId } from "mongodb"
import { NoUser, NoPost, NoComment } from './errorMessage.js';

export default {
  totalUsers: async (parent, args, { db }) => {
    return await db.collection('user').estimatedDocumentCount()
  },
  allUsers: async (parent, args, { db }) => {
    return await db.collection('user').find().toArray()
  },
  userById: async (parent, { userId }, { db }) => {
    const objectId = new ObjectId(userId);
    const findUser = await db.collection('user').findOne({ _id: objectId });
    if (!findUser) {
      throw NoUser;
    }
    return findUser;
  },
  userByLoginInfo: async(parent, { userLoginInfo }, { db }) => {
    const findUser = await db.collection('user').findOne({ $and: [
      { login: userLoginInfo.login },
      { loginType: userLoginInfo.loginType },
      { token: userLoginInfo.token }
    ]});
    if (!findUser) {
      throw NoUser;
    }
    return findUser;
  },
  totalPosts: async (parent, args, { db }) => {
    return await db.collection('post').estimatedDocumentCount();
  },
  allPosts: async (parent, {page, limit}, { db }) => {
    return await db.collection('post').find().sort({ created: -1 }).skip((page-1)*limit).limit(limit).toArray();
  },
  post: async (parent, { postId }, { db }) => {
    const _id = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id });
    if (!findPost) {
      throw NoPost;
    }
    return findPost
  },
  totalComments: async (parent, { postId }, { db }) => {
    return await db.collection('comment').find({ postId: new ObjectId(postId) }).count();
  },
  allComments: async (parent, { postId }, { db }) => {
    return await db.collection('comment').find({ postId: new ObjectId(postId) }).toArray();
  },
  comment: async (parent, { commentId }, { db }) => {
    const findComment = await db.collection('comment').findOne({ _id: new ObjectId(commentId) });
    if (!findComment) {
      throw NoComment;
    }
    return findComment;
  },
  me: async (parent, args, { currentUser }) => {
    if (!currentUser) {
      throw NotLoggedIn
    }
    return currentUser;
  }
}

