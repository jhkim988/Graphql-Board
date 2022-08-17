export const me = async (server) => {
  const me = await server.executeOperation({
    query: `
      query me {
        me {
          _id
          goodPost {
            _id
          }
          badPost {
            _id
          }
          posted {
            _id
          }
          commented {
            _id
          }
        }
      }
    `
  });
  return me;
}
export const createUser = async (server, user) => {
  const createUser = await server.executeOperation({
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
    variables: { userInfo: user }
  });
  return createUser;
}
export const userByLoginInfo = async (server, user) => {
  const userByLoginInfo = await server.executeOperation({
    query: `
      query userByLoginInfo($userLoginInfo: UserLoginInfo!) {
        userByLoginInfo(userLoginInfo: $userLoginInfo) {
          _id
        }
      }
    `,
    variables: {
      userLoginInfo: {
        login: user.login,
        loginType: user.loginType,
        token: user.token,
    }}
  });
  return userByLoginInfo;
}
export const userById = async (server, userId) => {
  const userById = await server.executeOperation({
    query: `
      query userById($userId: ID!) {
        userById(userId: $userId) {
          login
          loginType
          name
          avatar
          token
        }
      }
    `,
    variables: { userId }
  });
  return userById;
}
export const updateUser = async (server, userId, userInfo) => {
  const updateUser = await server.executeOperation({
    query: `
      mutation updateUser($userId: ID!, $userInfo: UserInfo!) {
        updateUser(userId: $userId, userInfo: $userInfo)
      }
    `,
    variables: { userId, userInfo }
  });
  return updateUser;
}
export const deleteUser = async (server, userId) => {
  const deleteUser = await server.executeOperation({
    query: `
      mutation deleteUser($userId: ID!) {
        deleteUser(userId: $userId)
      }
    `,
    variables: { userId }
  });
  return deleteUser;
}
export const createUserTest = (server, user) => async () => {
  const createUserExe = await createUser(server, user);
  expect(createUserExe.errors).toBeUndefined();
  for (let key in user) {
    expect(createUserExe.data?.createUser[key]).toBe(user[key]);
  }
}
export const updateUserTest = (server, user, userInfo) => async() => {
  const userByLoginInfoExe = await userByLoginInfo(server, user);
  expect(userByLoginInfoExe.errors).toBeUndefined();

  const user_id = userByLoginInfoExe.data.userByLoginInfo._id;
  const updateUserExe = await updateUser(server, user_id, userInfo);
  expect(updateUserExe.errors).toBeUndefined();
  expect(updateUserExe.data.updateUser).toBe('true');

  const userId = userByLoginInfoExe.data.userByLoginInfo._id;
  const userByIdExe = await userById(server, userId);
  expect(userByIdExe.errors).toBeUndefined();
  for (let key in userInfo) {
    expect(userByIdExe.data.userById[key]).toBe(userInfo[key]);
  }
  for (let key in user) {
    user[key] = userInfo[key];
  }
}

export const deleteUserTest = (server, user) => async() => {
  const userByLoginInfoExe = await userByLoginInfo(server, user);
  expect(userByLoginInfoExe.errors).toBeUndefined();
  const user_id = userByLoginInfoExe.data.userByLoginInfo._id;

  const deleteUserExe = await deleteUser(server, user_id);
  expect(deleteUserExe.errors).toBeUndefined();
  expect(deleteUserExe.data.deleteUser).toBe('true');

  const userByIdExe = await userById(server, user_id);
  expect(userByIdExe.errors).not.toBeUndefined();
}