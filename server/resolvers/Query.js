export default {
  totalUsers: async (parent, args, { db }) => {
    return await db.collection('user').estimatedDocumentCount()
  },
  allUsers: async (parent, args, { db }) => {
    return await db.collection('user').find().toArray()
  },
  totalPosts: async (parent, args, { db }) => {
    return await db.collection('post').estimatedDocumentCount()
  },
  allPosts: async (parent, {cursor, limit}, { db }) => {
    if (!cursor) return await db.collection('post').find().toArray();
    return await db.collection('post').find(p => p.created < cursor).sort({ created: -1 }).limit(limit).toArray();
  },
}

