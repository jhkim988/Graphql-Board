export const createPost = (server, postInfo) => async () => {
  const createResult = await server.executeOperation({
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

  expect(createResult.errors).toBeUndefined();
  post_id = createResult.data.createPost._id;

  for (let key in postInfo) {
    expect(createResult.data.createPost[key]).toBe(postInfo[key]);
  }
}

export const updatePost = (server, postInfo) => async () => {
  const updateResult = await server.executeOperation({
    query: `
      mutation updatePost($postId: ID!, $postInfo: PostInfo!) {
        updatePost(postId: $postId, postInfo: $postInfo)
      }
    `,
    variables: {
      postId: post_id, // How to get post_id?
      postInfo: postInfo
    }
  });
  expect(updateResult.errors).toBeUndefined();
  for (let key in postInfo) {
    expect(updateResult.data.updatePost[key]).toBe(postInfo[key]);
  }
}

export const deletePost = (server, postInfo) => async () => {
  const deleteResult = await server.executeOperation({
    query: `
      mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
      }
    `,
    variables: { postId: post_id }
  });
  expect(deleteResult.errors).toBeUndefined();
  expect(deleteResult.data.deletePost).toBe('true');

  const getResult = await server.executeOperation({
    query: `
      query post($postId: ID!) {
        _id
      }
    `,
    variables: { postId: post_id }
  });
  expect(deleteResult.errors).not.toBeUndefined();
}