import githubLogin from '../oauth/githubLogin.js';
import naverLogin from '../oauth/naverLogin.js';
import googleLogin from '../oauth/googleLogin.js';
import { ObjectId } from 'mongodb'
import { NoUser, NoPost, NoComment, AccessDenied, DuplicateGood, DuplicateBad, AcknowledgedFalse } from './errorMessage.js';

const fileNameGenerator = (fileName) => {
  const [ name, ext ] = fileName.spli('.');
  name.replace(/[.\s]/g, '');
  return `${(new Date()).toISOString().replace(/[^0-9]/g, '')}${name}.${ext}`;
}

export default {
  githubLogin,
  naverLogin,
  googleLogin,
  createUser: async (parent, { userInfo }, { db }) => {
    const newUser = { ...userInfo, created: new Date(), update: new Date()};
    await db.collection('user').insertOne( newUser );
    return newUser;
  },
  updateUser: async (parent, { userId, userInfo }, { db, currentUser }) => {
    const objectId = new ObjectId(userId);
    const findUser = await db.collection('user').findOne({ _id: objectId });
    if (!findUser) {
      throw NoUser;
    }
    if (userId != currentUser._id.toString()) {
      throw AccessDenied;
    }
    const { acknowledged } = await db.collection('user').updateOne({ _id: objectId }, { $set: { ...userInfo }});
    return acknowledged;
  },
  deleteUser: async (parent, { userId }, { db, currentUser }) => {
    const objectId = new ObjectId(userId);
    const findUser = await db.collection('user').findOne({ _id: objectId });
    if (!findUser) {
      throw NoUser;
    }
    if (userId != currentUser._id.toString()) {
      throw AccessDenied;
    }
    // delete all post and comment: Follow Service Policy
    await db.collection('comment').deleteMany({ userId: objectId });
    const postIdList = await db.collection('post').find({ userId: objectId }).toArray();
    for (let pid in postIdList) {
      db.collection('comment').deleteMany({ postId: pid._id });
    }
    await db.collection('post').deleteMany({ _id: { $in: postIdList }});
    const { acknowledged } = await db.collection('user').deleteOne({ _id: objectId });
    return acknowledged
  },
  createPhoto: async (parent, { file }, { currentUser }) => {
    if (!currentUser) {
      throw AccessDenied;
    }
    const { createReadStream, filename, mimetype, encoding } = await file;
    const saveName = fileNameGenerator(filename);
    const toPath = path.join(path.resolve(), 'assets', 'photos', saveName);
    const stream = createWriteStream();
    const out = fs.createWriteStream(toPath);
    await stream.pipe(out);
    return { filename: toPath, mimetype, encoding }
  },
  createPost: async (parent, { postInfo }, { db, currentUser }) => {
    if (!currentUser) {
      throw AccessDenied;
    }
    const newPost = {
      ...postInfo,
      good: 0,
      bad: 0,
      totalComments: 0,
      comments: [],
      goodBy: [],
      badBy: [],
      created: new Date(),
      updated: new Date(),
      userId: currentUser._id
    }
    await db.collection('post').insertOne(newPost);
    return newPost;
  },
  updatePost: async (parent, { postId, postInfo }, { db, currentUser }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw NoPost;
    }
    if (findPost.userId != currentUser._id.toString()) {
      throw AccessDenied;
    }
    const { acknowledged } = await db.collection('post').updateOne({ _id: objectId }, { $set: { ...postInfo, updated: new Date() }});
    return acknowledged;
  },
  deletePost: async (parent, { postId }, { db, currentUser }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw NoPost;
    }
    if (findPost.userId != currentUser._id.toString()) {
      throw AccessDenied;
    }
    // delete all inner comments:
    await db.collection('comment').deleteMany({ postId });
    
    // delete post:
    const { acknowledged } = await db.collection('post').deleteOne({ _id: objectId });
    return acknowledged;
  },
  createComment: async (parent, { postId, content }, { db, currentUser, pubsub }) => {
    if (!currentUser) {
      throw AccessDenied;
    }
    const objectId = new ObjectId(postId);
    const newComment = { content, userId: currentUser._id, postId: objectId, created: new Date() };
    const { acknowledged, insertedId } = await db.collection('comment').insertOne(newComment);

    pubsub.publish(`newComment${postId}`, {
      newComment: await db.collection('comment').findOne({ _id: insertedId })
    });
    
    // commentsAlarm
    const post = await db.collection('post').find({ _id: objectId });
    if (post._userId == currentUser._id.toString()) { // Does not alert to post writer.
      pubsub.publish(`commentAlarmToWriter${currentUser.id_.toString()}`);
    }
    
    return newComment;
  },
  deleteComment: async (parent, { commentId }, { db, currentUser, pubsub }) => {
    const objectId = new ObjectId(commentId);
    const findComment = await db.collection('comment').findOne({ _id: objectId });
    if (!findComment) {
      throw NoComment;
    }
    if (!findComment.userId == currentUser._id.toString()) {
      throw AccessDenied;
    }
    const { acknowledged } = await db.collection('comment').deleteOne({ _id: objectId });
    if (acknowledged) {
      const postId = findComment.postId
      pubsub.publish(`newDeleteComment${postId}`, { newDeleteComment: findComment._id });
    }
    return acknowledged;
  },
  addGood: async (parent, { postId }, { db, currentUser, pubsub }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw NoPost;
    }
    // Does not access: Duplicate good
    if (findPost.goodBy.find(user => user._id.equals(currentUser._id))) {
      throw DuplicateGood;  
    }
    const { acknowledged } = await db.collection('post').updateOne({ _id: objectId }, { $inc: { good: 1 }});
    if (acknowledged) {
      await db.collection('post').updateOne({ _id: objectId }, { $push: { goodBy: currentUser }});
      pubsub.publish(`addGood${postId}`, {
        newAddGood: await db.collection('post').findOne({ _id: objectId })
      });
    }
    return acknowledged;
  },
  addBad: async (parent, { postId }, { db, currentUser, pubsub }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw NoPost;
    }
    // Does not access: Duplicate Bad
    if (findPost.badBy.find(user => user._id.equals(currentUser._id))) {
      throw DuplicateBad;
    }
    const { acknowledged } = await db.collection('post').updateOne({ _id: objectId }, { $inc: { bad: 1 }});
    if (acknowledged) {
      await db.collection('post').updateOne({ _id: objectId }, { $push: { badBy: currentUser }});
      pubsub.publish(`addBad${postId}`, { newAddBad: await db.collection('post').findOne({ _id: objectId })});
    }
    return acknowledged;
  }
}