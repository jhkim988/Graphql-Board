export default {
  totalUsers: async (parent, args, { db }) => {
    return await db.collection('user').estimatedDocumentCount()
  },
  allUsers: async (parent, args, { db }) => {
    return await db.collection('user').find().toArray()
  },
  user: async (parent, { userId }, { db }) => {
    return await db.collection('user').findOne({ _id: userId })
  },
  totalPosts: async (parent, args, { db }) => {
    return await db.collection('post').estimatedDocumentCount()
  },
  allPosts: async (parent, {cursor, limit}, { db }) => {
    if (!cursor) return await db.collection('post').find().toArray();
    return await db.collection('post').find(p => p.created < cursor).sort({ created: -1 }).limit(limit).toArray();
  },
  post: async (parent, { postId }, { db }) => {
    return await db.collection('post').findOne({ _id: postId });
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

