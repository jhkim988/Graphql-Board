import fetch from 'node-fetch'

const requestGithubToken = async (credentials) => {
  const res = await fetch('https://github.com/login/oauth/access_token',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)});
    return await res.json();
  }

const requestGithubUserAccount = async (token) => {
  const res = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${token}`
    }
  });
  return await res.json();
}

const githubLogin = async (parent, { code }, { db }) => {
  const { access_token } = await requestGithubToken(
    {
      code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET
    });
  const { message, avatar_url, login, name } = await requestGithubUserAccount(access_token);
  if (message) {
    throw new Error(message);
  }
  console.log(login, name, avatar_url);
  const latestUserInfo = {
    login,
    name,
    avatar: avatar_url,
    loginType: 'GITHUB',
  }
  await db.collection('user').replaceOne({ login, loginType: 'GITHUB '}, latestUserInfo, { upsert: true });
  const user = await db.collection('user').findOne({ login, loginType: 'GITHUB'});
  return { user, token: access_token };
}

export default githubLogin;