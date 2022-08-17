import fetch from 'node-fetch'

const requestNaverToken = credentials => fetch('https://nid.naver.com/oauth2.0/authorize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  body: JSON.stringify(credentials)
});

const requestNaverUserAccount = token => fetch('https://openapi.naver.com/v1/nid/me', {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`
  }
});

export default () => {

}