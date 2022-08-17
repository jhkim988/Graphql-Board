import { me } from './testUser.js';
import { createPost, queryPost } from './testPost.js';

export const createComment = async (server, postId, content) => {
  const createComment = await server.executeOperation({
    query: `
      mutation createComment($postId: ID!, $content: String!) {
        createComment(postId: $postId, content: $content) {
          _id
          content
          commentedOn {
            _id
          }
          commentedBy {
            _id
          }
          userId
          postId
        }
      }
    `,
    variables: { postId, content }
  });
  return createComment;
}
export const deleteComment = async (server, commentId) => {
  const deleteComment = await server.executeOperation({
    query: `
      mutation deleteComment($commentId: ID!) {
        deleteComment(commentId: $commentId)
      }
    `,
    variables: { commentId }
  });
  return deleteComment;
}
export const queryComment = async (server, commentId) => {
  const queryComment = await server.executeOperation({
    query: `
      query comment($commentId: ID!) {
        comment(commentId: $commentId) {
          _id
          commentedOn {
            _id
          }
          commentedBy {
            _id
          }
        }
      }
    `,
    variables: { commentId }
  });
  return queryComment;
}
export const totalComments = async (server, postId) => {
  const totalComments = await server.executeOperation({
    query: `
      query totalComments($postId: ID!) {
        totalComments(postId: $postId)
      }
    `,
    variables: { postId }
  });
  return totalComments;
}
export const allComments = async (server, postId) => {
  const allComments = await server.executeOperation({
    query: `
      query allComments($postId: ID!) {
        allComments(postId: $postId) {
          _id
        }
      }
    `,
    variables: { postId }
  });
  return allComments;
}
export const createCommentTest = (server) => async () => {
  const meBefore = await me(server);
  expect(meBefore.errors).toBeUndefined();
  expect(meBefore.data.me._id).not.toBeUndefined();
  const user_id = meBefore.data.me._id;
  
  const createPostExe = await createPost(server, { title: 'title', content: 'content', photo: 'photo'});
  expect(createPostExe.errors).toBeUndefined();
  expect(createPostExe.data.createPost._id).not.toBeUndefined();
  const post_id = createPostExe.data.createPost._id;

  const totalCommentsBefore = await totalComments(server, post_id);
  expect(totalCommentsBefore.errors).toBeUndefined();
  const allCommentsBefore = await allComments(server, post_id);
  expect(allCommentsBefore.errors).toBeUndefined();

  const commentText = 'comment text';
  const createCommentExe = await createComment(server, post_id, commentText);
  expect(createCommentExe.errors).toBeUndefined();
  expect(createCommentExe.data.createComment.content).toBe(commentText);
  expect(createCommentExe.data.createComment.commentedOn._id).toBe(post_id);
  expect(createCommentExe.data.createComment.commentedBy._id).toBe(user_id);

  const meAfter = await me(server);
  expect(meAfter.errors).toBeUndefined();
  expect(meAfter.data.me.commented.length).toBe(meBefore.data.me.commented.length+1);

  const postAfter = await queryPost(server, post_id);
  expect(postAfter.errors).toBeUndefined();
  expect(createPostExe.data.createPost.comments.length+1).toBe(postAfter.data.post.comments.length);

  const commentId = createCommentExe.data.createComment._id;
  const queryCommentAfter = await queryComment(server, commentId);
  expect(queryCommentAfter.errors).toBeUndefined();
  expect(queryCommentAfter.data.comment.commentedBy._id).toBe(meAfter.data.me._id);
  expect(queryCommentAfter.data.comment.commentedOn._id).toBe(post_id);

  const totalCommentsAfter = await totalComments(server, post_id);
  expect(totalCommentsAfter.errors).toBeUndefined();
  const allCommentsAfter = await allComments(server, post_id);
  expect(allCommentsAfter.errors).toBeUndefined();

  expect(totalCommentsBefore.data.totalComments+1).toBe(totalCommentsAfter.data.totalComments);
  expect(allCommentsBefore.data.allComments.length+1).toBe(allCommentsAfter.data.allComments.length);
}

export const deleteCommentTest = (server) => async () => {
  const meBefore = await me(server);
  expect(meBefore.errors).toBeUndefined();
  expect(meBefore.data.me.commented[0]._id).not.toBeUndefined();

  const commentId = meBefore.data.me.commented[0]._id;
  const queryCommentBefore = await queryComment(server, commentId);
  expect(queryCommentBefore.errors).toBeUndefined();

  const postId = queryCommentBefore.data.comment.commentedOn._id;

  const totalCommentsBefore = await totalComments(server, postId);
  expect(totalCommentsBefore.errors).toBeUndefined();
  const allCommentsBefore = await allComments(server, postId);
  expect(allCommentsBefore.errors).toBeUndefined();

  const postBefore = await queryPost(server, postId);
  expect(postBefore.errors).toBeUndefined();
  
  const deleteCommentExe = await deleteComment(server, commentId);
  expect(deleteCommentExe.errors).toBeUndefined();

  const meAfter = await me(server);
  expect(meAfter.errors).toBeUndefined();

  const postAfter = await queryPost(server, postId);
  expect(postAfter.errors).toBeUndefined();

  expect(meAfter.data.me.commented.length+1).toBe(meBefore.data.me.commented.length);
  expect(postAfter.data.post.comments.length+1).toBe(postBefore.data.post.comments.length);

  const totalCommentsAfter = await totalComments(server, postId);
  expect(totalCommentsAfter.errors).toBeUndefined();
  const allCommentsAfter = await allComments(server, postId);
  expect(allCommentsAfter.errors).toBeUndefined();

  expect(totalCommentsBefore.data.totalComments).toBe(totalCommentsAfter.data.totalComments+1);
  expect(allCommentsBefore.data.allComments.length).toBe(allCommentsAfter.data.allComments.length+1);
}