import { me } from './testUser.js';
import { createPost, queryPost } from './testPost.js';

export const addGood = async (server, postId) => {
  const addGoodQuery = await server.executeOperation({
    query: `
      mutation addGood($postId: ID!) {
        addGood(postId: $postId)
      }
    `,
    variables: { postId }
  });
  return addGoodQuery;
}

export const addBad = async (server, postId) => {
  const addBadQuery = await server.executeOperation({
    query: `
      mutation addBad($postId: ID!) {
        addBad(postId: $postId)
      }
    `,
    variables: { postId }
  });
  return addBadQuery;
}

export const addGoodTest = (server) => async () => {
  const meBefore = await me(server);
  const createPostExe = await createPost(server, { title: 'title', content: 'content' });
  expect(createPostExe.errors).toBeUndefined();

  const postId = createPostExe.data.createPost._id;
  const addGoodExe = await addGood(server, postId);
  expect(addGoodExe.errors).toBeUndefined();
  expect(addGoodExe.data.addGood).toBe('true');

  const postAfter = await queryPost(server, postId);
  expect(postAfter.errors).toBeUndefined();
  expect(createPostExe.data.createPost.good+1).toBe(postAfter.data.post.good);
  expect(createPostExe.data.createPost.goodBy.length+1).toBe(postAfter.data.post.goodBy.length);
  
  const meAfter = await me(server);
  expect(meAfter.errors).toBeUndefined();
  expect(meBefore.data.me.goodPost.length+1).toBe(meAfter.data.me.goodPost.length);

  const addGoodDouble = await addGood(server, postId);
  expect(addGoodDouble.errors).not.toBeUndefined();
}

export const addBadTest = (server) => async () => {
  const meBefore = await me(server);
  const createPostExe = await createPost(server, { title: 'title', content: 'content' });
  expect(createPostExe.errors).toBeUndefined();

  const postId = createPostExe.data.createPost._id;
  const addBadExe = await addBad(server, postId);
  expect(addBadExe.errors).toBeUndefined();
  expect(addBadExe.data.addBad).toBe('true');

  const postAfter = await queryPost(server, postId);
  expect(postAfter.errors).toBeUndefined();
  expect(createPostExe.data.createPost.bad+1).toBe(postAfter.data.post.bad);
  expect(createPostExe.data.createPost.badBy.length+1).toBe(postAfter.data.post.badBy.length);
  
  const meAfter = await me(server);
  expect(meAfter.errors).toBeUndefined();
  expect(meBefore.data.me.badPost.length+1).toBe(meAfter.data.me.badPost.length);

  const addBadDouble = await addBad(server, postId);
  expect(addBadDouble.errors).not.toBeUndefined();
}