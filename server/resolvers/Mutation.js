import githubLogin from '../auth/githubLogin.js';
import naverLogin from '../auth/naverLogin.js';
import googleLogin from '../auth/googleLogin.js';
import { ObjectId } from 'mongodb'

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
  updateUser: async (parent, { userId, userInfo }, { db }) => {
    const objectId = new ObjectId(userId);
    const findUser = await db.collection('user').findOne({ _id: objectId });
    if (!findUser) {
      throw new Error('There is No User');
    }
    const { acknowledged } = await db.collection('user').updateOne({ _id: objectId }, { $set: { ...userInfo }});
    return acknowledged;
  },
  deleteUser: async (parent, { userId }, { db }) => {
    const objectId = new ObjectId(userId);
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
  createPhoto: async (parent, { file }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const saveName = fileNameGenerator(filename);
    const toPath = path.join(path.resolve(), 'assets', 'photos', saveName);
    const stream = createWriteStream();
    const out = fs.createWriteStream(toPath);
    await stream.pipe(out);
    return { filename: toPath, mimetype, encoding }
  },
  createPost: async (parent, { postInfo }, { db, currentUser }) => {
    if (!currentUser?._id) {
      throw new Error(`Access Denied.`);
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
    return {...newPost };
  },
  updatePost: async (parent, { postId, postInfo }, { db, currentUser }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw new Error("There is No Post.");
    }
    if (!findPost.userId.equals(currentUser._id)) {
      throw new Error(`Access Denied.`);
    }
    const { acknowledged } = await db.collection('post').updateOne({ _id: objectId }, { $set: { ...postInfo, updated: new Date() }});
    return acknowledged;
  },
  deletePost: async (parent, { postId }, { db, currentUser }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw Error("There is No Post.");
    }
    if (!findPost.userId.equals(currentUser._id)) {
      throw new Error(`Access Denied.`);
    }
    // delete all inner comments:
    await db.collection('comment').deleteMany({ postId });
    
    // delete post:
    const { acknowledged } = await db.collection('post').deleteOne({ _id: objectId });
    return acknowledged;
  },
  createComment: async (parent, { postId, content }, { db, currentUser, pubsub }) => {
    if (!currentUser) {
      throw new Error(`Access Denied.`);
    }
    const objectId = new ObjectId(postId);
    const newComment = { content, userId: currentUser._id, postId: objectId };
    await db.collection('comment').insertOne(newComment);
    pubsub.publish(`newComment${postId}`)
    
    // commentsAlarm
    const post = await db.collection('post').find({ _id: postId });
    if (post._userId == currentUser._id) { // Does not alert to post writer.
      pubsub(currentUser._id.toString());
    }
    
    return newComment;
  },
  deleteComment: async (parent, { commentId }, { db }) => {
    const objectId = new ObjectId(commentId);
    const findComment = await db.collection('comment').findOne({ _id: objectId });
    if (!findComment) {
      throw new Error("There is No Comment");
    }
    if (!findComment.commentedBy._id.equals(currentUser._id)) {
      throw new Error(`Access Denied.`);
    }
    const { acknowledged } = await db.collection('comment').deleteOne({ _id: objectId });
    return acknowledged;
  },
  addGood: async (parent, { postId }, { db, currentUser, pubsub }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw new Error("There is No Post");
    }
    // Does not access: Duplicate good
    if (findPost.goodBy.find(user => user._id.equals(currentUser._id))) return false;
    const { acknowledged } = await db.collection('post').updateOne({ _id: objectId }, { $inc: { good: 1 }});
    if (acknowledged) {
      await db.collection('post').updateOne({ _id: objectId }, { $push: { goodBy: currentUser }});
      pubsub.publish(`newScore${postId}`);
    }
    return acknowledged;
  },
  addBad: async (parent, { postId }, { db, currentUser, pubsub }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw new Error("There is No Post");
    }
    // Does not access: Duplicate Bad
    if (findPost.badBy.find(user => user._id.equals(currentUser._id))) return false;
    const { acknowledged } = await db.collection('post').updateOne({ _id: objectId }, { $inc: { bad: 1 }});
    if (acknowledged) {
      await db.collection('post').updateOne({ _id: objectId }, { $push: { badBy: currentUser }});
      pubsub.publish(`newScore${postId}`);
    }
    return acknowledged;
  }
}