import { useMutation, useApolloClient } from "@apollo/client";
import { Fragment, useEffect } from "react";
import { GITHUB_LOGIN, ME } from './operations.js';

const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user`;

const Login = ({ setIsLoggedIn }) => {
  const client = useApolloClient();
  const [ githubLoginMutation ] = useMutation(GITHUB_LOGIN);
  useEffect(() => {
    if (window.location.href.match('code=')) {
      const code = window.location.search.replace('?code=', '');
      githubLoginMutation({
        variables: { code },
        update: (cache, { data: { githubLogin: { token, user: { login, loginType, name, avatar }}}}) => {
          client.writeQuery({
            query: ME,
            data: {
              me: { login, loginType, name, avatar }
            }
          });
          localStorage.setItem('token', token);
          localStorage.setItem('login', login);
          localStorage.setItem('loginType', loginType);
          setIsLoggedIn(true);
          window.history.pushState(null, 'WelCome GraphQL WebService', '/');
        }
      });
    }
  }, []);
  return (
    <Fragment>
      <a href={GITHUB_LOGIN_URL}><button className='btn btn-warning'>Github 로그인</button></a>
      <a href='' role='button' className='btn btn-success'>Naver 로그인</a>
      <a href='' role='button' className='btn btn-danger'>Google 로그인</a>
    </Fragment>
  );
}
export default Login;