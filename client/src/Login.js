import { gql, useMutation, useApolloClient } from "@apollo/client";
import { Fragment, useEffect, useState } from "react";

const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user`;
const GITHUB_LOGIN = gql`
  mutation githubLogin($code: String!) {
    githubLogin(code: $code) {
      user {
        name
        login
        loginType
        avatar
      }
      token
    }
  }
`
const ME = gql`
  query me {
    me {
      login
      loginType
      name
      avatar
    }
  }
`

const CurrentUser = ({ meCache, setIsLoggedIn }) => {
  const client = useApolloClient();
  const logout = () => {
    localStorage.setItem('token', null);
    client.writeQuery({ query: ME, data: null });
    setIsLoggedIn(false);
    // window.location.reload();
  }
  return (
    <div className='row'>
      <img src={meCache.me.avatar} width={48} height={48} alt='' className='col-2'/>
      <p className='col-2'>Hello, {meCache.me.name}!</p>
      <button onClick={logout} className='col-1'>logout</button>
    </div>
  );
}

const Login = () => {
  const client = useApolloClient();
  const meCache = client.readQuery({ query: ME });
  const [ isLoggedIn, setIsLoggedIn ] = useState(meCache !== null);
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
          setIsLoggedIn(true);
          window.history.pushState(null, 'WelCome GraphQL WebService', '/');
        }
      });
    }
  }, []);

  if (isLoggedIn) {
    return <CurrentUser setIsLoggedIn={setIsLoggedIn} meCache={meCache}/>
  } else {
    return (
      <Fragment>
        <a href={GITHUB_LOGIN_URL}><button className='btn btn-warning'>Github 로그인</button></a>
        <a href='' role='button' className='btn btn-success'>Naver 로그인</a>
        <a href='' role='button' className='btn btn-danger'>Google 로그인</a>
      </Fragment>
    );
  }
}

export default Login;