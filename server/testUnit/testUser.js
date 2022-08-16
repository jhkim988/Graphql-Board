export const createUser = (server, user) => (async () => {
  const result = await server.executeOperation({
    query: `
      mutation createUser($userInfo: UserInfo!) {
        createUser(userInfo: $userInfo) {
          login
          loginType
          name
          avatar
          token
        }
      }
    `,
    variables: {
      userInfo: {
        ...user
      }
    }
  });
  expect(result.errors).toBeUndefined();
  for (let key in user) {
    expect(result.data?.createUser[key]).toBe(user[key]);
  }
});

export const updateUser = (server, user, userInfo) => (async() => {
  const getUserByLoginInfo = await server.executeOperation({
    query: `
      query getUserByLoginInfo($userLoginInfo: UserLoginInfo!) {
        getUserByLoginInfo(userLoginInfo: $userLoginInfo) {
          _id
        }
      }
    `,
    variables: {
      userLoginInfo: {
        login: user.login,
        loginType: user.loginType,
        token: user.token,
      }
    }
  });
  expect(getUserByLoginInfo.errors).toBeUndefined();

  const result = await server.executeOperation({
    query: `
      mutation updateUser($userId: ID!, $userInfo: UserInfo!) {
        updateUser(userId: $userId, userInfo: $userInfo)
      }
    `,
    variables: {
      userId: getUserByLoginInfo.data.getUserByLoginInfo._id,
      userInfo: userInfo
    }
  });
  expect(result.errors).toBeUndefined();

  const validate = await server.executeOperation({
    query: `
      query getUserById($userId: ID!) {
        getUserById(userId: $userId) {
          login
          loginType
          name
          avatar
          token
        }
      }
    `,
    variables: {
      userId: getUserByLoginInfo.data.getUserByLoginInfo._id
    }
  });
  expect(validate.errors).toBeUndefined();
  for (let key in userInfo) {
    expect(validate.data.getUserById[key]).toBe(userInfo[key]);
  }
});

export const deleteAllUser = (server) => (async() => {
  const getAllUsers = await server.executeOperation({
    query: `
      query allUsers {
        allUsers {
          _id
        }
      }
    `
  });
  expect(getAllUsers.errors).toBeUndefined();
  getAllUsers.data.allUsers.forEach(async ({ _id }) => {
    const result = await server.executeOperation({
      query: `
        mutation deleteUser($userId: ID!) {
          deleteUser(userId: $userId)
        }
      `,
      variables: {
        userId: _id
      }
    });
    expect(result.errors).toBeUndefined();
    expect(result.data.deleteUser).toBe('true');
  });
});