import { me } from './testUser';

export const createPost = async (server, postInfo) => {
  const createPost = await server.executeOperation({
    query: `
      mutation createPost($postInfo: PostInfo!) {
        createPost(postInfo: $postInfo) {
          _id
          title
          content
          photo
        }
      }
    `,
    variables: { postInfo }
  });
  return createPost;
}
export const updatePost = async (server, postId, postInfo) => {
  const updatePost = await server.executeOperation({
    query: `
      mutation updatePost($postId: ID!, $postInfo: PostInfo!) {
        updatePost(postId: $postId, postInfo: $postInfo)
      }
    `,
    variables: { postId, postInfo }
  });
  return updatePost;
}
export const queryPost = async (server, postId) => {
  const queryPost = await server.executeOperation({
    query: `
      query post($postId: ID!) {
        post(postId: $postId) {
          title
          content
          photo
        }
      }
    `,
    variables: { postId }
  });
  return queryPost;
}
export const deletePost = async (server, postId) => {
  const deletePost = await server.executeOperation({
    query: `
      mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
      }
    `,
    variables: { postId }
  });
  return deletePost
}

export const createPostTest = (server, postInfo) => async () => {
  const createPostExe = await createPost(server, postInfo);
  expect(createPostExe.errors).toBeUndefined();
  let post_id = createPostExe.data.createPost._id;

  for (let key in postInfo) {
    expect(createPostExe.data.createPost[key]).toBe(postInfo[key]);
  }

  const currentUser = await me(server);
  expect(currentUser.errors).toBeUndefined();
  expect(currentUser.data.me.posted.find(x => x._id == post_id)).toBeTruthy();
}
export const updatePostTest = (server, postInfo) => async () => {
  const currentUser = await me(server);
  expect(currentUser.errors).toBeUndefined();
  const post_id = currentUser.data.me.posted[0]._id;

  const updatePostExe = await updatePost(server, post_id, postInfo);
  expect(updatePostExe.errors).toBeUndefined();
  expect(updatePostExe.data.updatePost).toBe('true');

  const queryPostExe = await queryPost(server, post_id);
  expect(queryPostExe.errors).toBeUndefined();
  for (let key in postInfo) {
    expect(queryPostExe.data.post[key]).toBe(postInfo[key]);
  }
}

export const deletePostTest = (server, postInfo) => async () => {
  const currentUserBefore = await me(server);
  expect(currentUserBefore.errors).toBeUndefined();
  const post_id = currentUserBefore.data.me.posted[0]._id

  const deletePostExe = await deletePost(server, post_id);
  expect(deletePostExe.errors).toBeUndefined();
  expect(deletePostExe.data.deletePost).toBe('true');

  const queryPostExe = await queryPost(server, post_id);
  expect(queryPostExe.errors).not.toBeUndefined();
  
  const currentUserAfter = await me(server);
  expect(currentUserAfter.error).toBeUndefined();
  expect(currentUserAfter.data.me.posted.length+1).toBe(currentUserBefore.data.me.posted.length);
}