import { me, userByLoginInfo } from './testUser.js';
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
      muataion deleteComment($commentId: ID!) {
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
        }
      }
    `,
    variables: { commentId }
  });
  return queryComment;
}

export const createCommentTest = (server, user) => async () => {
  const userByLoginInfoExe = await userByLoginInfo(server, user);
  expect(userByLoginInfoExe.errors).toBeUndefined();
  expect(userByLoginInfoExe.data.userByLoginInfo._id).not.toBeUndefined();
  const user_id = userByLoginInfoExe.data.userByLoginInfo._id;

  const createPostExe = await createPost(server, { title: 'title', content: 'content', photo: 'photo'});
  expect(createPostExe.errors).toBeUndefined();
  expect(createPostExe.data.createPost._id).not.toBeUndefined();
  const post_id = createPostExe.data.createPost._id;

  const commentText = 'comment text';
  const createCommentExe = await createComment(server, post_id, commentText);
  expect(createCommentExe.errors).toBeUndefined();
  expect(createCommentExe.data.createComment.content).toBe(commentText);
  expect(createCommentExe.data.createComment.commentedOn._id).toBe(post_id);
  expect(createCommentExe.data.createComment.commentedBy._id).toBe(user_id);

  const meAfter = await me(server);
  expect(meAfter.errors).toBeUndefined();
  expect(meAfter.data.me.data.comments.length).toBe(me.meBefore.me.data.comments.length+1);

  const postAfter = await queryPost(server, post_id);
  expect(postAfter.errors).toBeUndefined();
  expect(createPostExe.data.createPost.comments.length).toBe(postAfter.data.queryPost.comments.length+1);
}

export const deleteCommentTest = (server) => async () => {
  const meBefore = await me(server);
  expect(meBefore.errors).toBeUndefined();

  const commentId = meBefore.data.me.commented[0]._id;
  const queryCommentBefore = await queryComment(server, commentId);
  expect(queryCommentBefore.errors).toBeUndefined();

  const postId = queryCommentBefore.data.queryComment.commentedOn._id;
  const postBefore = await queryPost(server, postId);
  expect(postBefore.errors).toBeUndefined();
  
  const deleteCommentExe = await deleteComment(server, commentId);
  expect(deleteCommentExe.errors).toBeUndefined();

  const meAfter = await me(server);
  expect(meAfter.errors).toBeUndefined();

  const postAfter = await queryPost(server, postId);
  expect(postAfter.errors).toBeUndefined();

  expect(meAfter.data.me.comments.length+1).toBe(meBefore.data.me.comments.length);
  expect(postAfter.data.queryPost.comments.length+1).toBe(postBefore.data.me.comments.length);
}