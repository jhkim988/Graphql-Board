import fetch from 'node-fetch'

const requestGithubToken = credentials => fetch('https://github.com/login/oauth/access_token',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credentials)
  }
);

const requestGithubUserAccount = token => fetch('https://api.github.com/user', {
  method: 'GET',
  headers: {
    Accept: 'application/vnd.github+json',
    Authorization: `token ${token}`
  }
}).then(res => res.json())
  .catch(err => {throw new Error(err)});

export default async (parent, { code }, { db }) => {
  const { access_token } = requestGithubToken(code);
  const { message, avatar_url, login, name } = requestGithubUserAccount(access_token);
  if (message) {
    throw new Error(message);
  }

  const latestUserInfo = {
    login,
    loginType: 'GITHUB',
    name,
    avatar: avatar_url,
  }
  const user = await db.collection('user').replaceOne({ login, loginType: 'GITHUB '}, latestUserInfo, { upsert: true });
  return { user, access_token };
}