export default {
  commentsAlarm: {
    subscribe: (parent, args, { pubsub, currentUser }) => {
      return pubsub.asyncIterator(currentUser.id);
    }
  },
  newScore: {
    subscribe: (parent, { postId }, { pubsub }) => {
      return pubsub.asyncIterator(`newScore${postId}`);
    }
  },
  newComment: {
    subscribe: (parent, { postId }, { pubsub }) => {
      return pubsub.asyncIterator(`newComment${postId}`);
    }
  }
}