import githubLogin from '../auth/githubLogin.js';
import naverLogin from '../auth/naverLogin.js';
import googleLogin from '../auth/googleLogin.js';
import { ObjectId } from 'mongodb'

const fileNameGenerator = (fileName) => {

}

export default {
  githubLogin,
  naverLogin,
  googleLogin,
  deleteUser: async (parent, { userId }, { db }) => {
    const objectId = new ObjectId(userId);
    // delete all post and comment: Follow Service Policy
    await db.collection('comment').deleteAll({ userId: objectId });
    const postIdList = await db.collection('post').findAll({ userId: objectId }).toArray().map(p => p._id);
    for (pid in postIdList) {
      db.collection('comment').deleteAll({ postId: pid });
    }
    await db.collection('post').deleteAll({ _id: { $in: postIdList }});
    const { acknowledged } = await db.collection('user').deleteOne({ _id: objectId });
    return acknowledged
  },
  createPhoto: async (parent, { file }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;
    const saveName = fileNameGenerator(filename);
    const toPath = path.join(path.resolve(), 'assets', 'photos', saveName);
    const stream = fs.createWriteStream(toPath);
    const out = fs.createWriteStream(toPath);
    await stream.pipe(out);
    return { filename: toPath, mimetype, encoding }
  },
  createPost: async (parent, { postInfo }, { db, currentUser }) => {
    const newPost = {
      ...postInfo,
      good: 0,
      bad: 0,
      created: new Date(),
      updated: new Date(),
      goodBy: [],
      badBy: [],
      userId: currentUser._id
    }
    await db.collection('post').insertOne(newPost);
    return {...newPost };
  },
  updatePost: async (parent, { postId, postInfo }, { db }) => {
    const objectId = new ObjectId(postId);
    const find = await db.collection('post').findOne({ _id: objectId });
    if (!find) {
      throw Error("There is No Post.");
    }
    const { acknowledged } = await db.collection('post').replaceOne({ _id: objectId }, {...postInfo, updated: new Date()});
    return acknowledged;
  },
  deletePost: async (parent, { postId }, { db }) => {
    const objectId = new ObjectId(postId);
    const find = await db.collection('post').findOne({ _id: objectId });
    if (!find) {
      throw Error("There is No Post.");
    }

    // delete all inner comments:
    await db.collection('comment').deleteMany({ postId });
    
    // delete post:
    const { acknowledged } = await db.collection('post').deleteOne({ _id: objectId });
    return acknowledged;
  },
  createComment: async (parent, { postId, content }, { db, currentUser, pubsub }) => {
    const newComment = { content, userId: currentUser._id, postId };
    await db.collection('content').insertOne(newComment);
    pubsub.publish(`newComment${postId}`)
    
    // commentsAlarm
    const postWriter = await db.collection('post').findOne({postId: new Object(postId)})
    if (postWriter._id.toString() !== currentUser._id.toString() ) { // Does not alert to post writer.
      pubsub(currentUser._id.toString());
    }
    
    return newComment;
  },
  deleteComment: async (parent, { commentId }, { db }) => {
    const objectId = new ObjectId(commentId);
    const find = await db.collection('comment').findOne({ _id: objectId });
    if (!find) {
      throw new Error("There is No Comment");
    }
    const { acknowledged } = await db.collection('comment').deleteOne({ _id: objectId });
    return acknowledged;
  },
  addGood: async (parent, { postId }, { db, currentUser }) => {
    const objectId = new ObjectId(postId);
    const findPost = await db.collection('post').findOne({ _id: objectId });
    if (!findPost) {
      throw new Error("There is No Post");
    }
    // Does not access: Duplicate good
    if (!findPost.goodBy.find(user => user._id == currentUser._id)) return false;
    findPost.goodBy.append( currentUser );
    const { acknowledged } = await db.collection('post').replaceOne({ _id: objectId }, { good: findPost.good+1, goodBy: findPost.goodBy });
    if (acknowledged) {
      findPost.goodBy.push(currentUser._id);
      pubsub.publish(`newScore${postId}`);
    }
    return acknowledged;
  },
  addBad: async (parent, { postId }, { db, currentUser }) => {
    const objectId = new ObjectId(postId);
    const find = await db.collection('post').findOne({ _id: objectId });
    if (!find) {
      throw new Error("There is No Post");
    }
    // Does not access: Duplicate Bad
    if (!findPost.badBy.find(user => user._id == currentUser._id)) return false;
    findPost.badBy.append( currentUser );
    const { acknowledged } = await db.collection('post').replaceOne({ _id: objectId }, { bad: find.bad+1, badBy: findPost.badBy });
    if (acknowledged) {
      findPost.badBy.push(currentUser._id);
      pubsub.publish(`newScore${postId}`);
    }
    return acknowledged;
  }
}