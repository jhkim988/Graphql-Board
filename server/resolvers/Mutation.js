import githubLogin from '../auth/githubLogin.js';
import naverLogin from '../auth/naverLogin.js';
import googleLogin from '../auth/googleLogin.js';

export default {
  githubLogin,
  naverLogin,
  googleLogin,
  deleteUser: async (parent, { userAccess }, { db }) => {
    const { acknowledged } = await db.collection('user').deleteOne({ userAccess });
    return acknowledged
  },
  createPost: async (parent, { postInfo }, { db, currentUser }) => {
    const newPost = {
      ...postInfo,
      good: 0,
      bad: 0,
      totalComments: 0,
      userId: currentUser.id
    }
    await db.collection('post').insert(newPost);
    return newPost;
  },
  updatePost: async (parent, { postId, postInfo }, { db }) => {
    const find = await db.collection('post').findOne({ id: postId });
    if (!find) {
      throw Error("There is No Post.");
    }
    const { acknowledged } = await db.collection('post').update({ id: postId },{ ...postInfo });
    return acknowledged;
  },
  deletePost: async (parent, { postId }, { db }) => {
    const find = await db.collection('post').findOne({ id: postId });
    if (!find) {
      throw Error("There is No Post.");
    }
    const { acknowledged } = await db.collection('post').delete({ id: postId });
    return acknowledged;
  },
  createComment: async (parent, { postId, content }, { db, currentUser, pubsub }) => {
    const newComment = { content, userId: currentUser.id, postId };
    await db.collection('content').insert(newComment);
    pubsub.publish(`newComment${postId}`)
    return newComment;
  },
  deleteComment: async (parent, { commentId }, { db }) => {
    const find = await db.collection('comment').findOne({ id: commentId });
    if (!find) {
      throw new Error("There is No Comment");
    }
    const { acknowledged } = await db.collection('comment').deleteOne({ id: commentId });
    return acknowledged;
  },
  addGood: async (parent, { postId }, { db }) => {
    const find = await db.collection('post').findOne({ id: postId });
    if (!find) {
      throw new Error("There is No Post");
    }
    find.good += 1;
    const { acknowledged } = await db.collection('post').update({ id: postId }, { ...find });
    if (acknowledged) pubsub.publish(`newScore${postId}`)
    return acknowledged;
  },
  addBad: async (parent, { postId }, { db }) => {
    const find = await db.collection('post').findOne({ id: postId });
    if (!find) {
      throw new Error("There is No Post");
    }
    find.good -= 1;
    const { acknowledged } = await db.collection('post').update({ id: postId }, { ...find });
    if (acknowledged) pubsub.publish(`newScore${postId}`)
    return acknowledged;
  }
}