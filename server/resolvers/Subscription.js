export default {
  commentsAlarm: {
    subscribe: (parent, args, { pubsub, currentUser }) => {
      return pubsub.asyncIterator([`commentAlarmToWriter${currentUser._id.toString()}`]);
    }
  },
  newAddGood: {
    subscribe: (parent, { postId }, { pubsub }) => {
      return pubsub.asyncIterator([`addGood${postId}`]);
    }
  },
  newAddBad: {
    subscribe: (parent, { postId }, { pubsub }) => {
      return pubsub.asyncIterator([`addBad${postId}`]);
    }
  },
  newComment: {
    subscribe: (parent, { postId }, { pubsub }) => {
      return pubsub.asyncIterator([`newComment${postId}`]);
    }
  },
  newDeleteComment: {
    subscribe: (parent, { postId }, { pubsub }) => {
      return pubsub.asyncIterator([`newDeleteComment${postId}`]);
    }
  }
}