import { gql, useMutation } from "@apollo/client";
import { Fragment, useEffect, useState } from "react";

const GITHUB_LOGIN = gql`
  mutation githubLogin($code: String!) {
    githubLogin(code: $code) {
      user {
        name
      }
      token
    }
  }
`

const logout = () => {

}
const CurrentUser = ({ name, avatar }) => {
  return (
    <div className='row'>
      <img src={avatar} width={48} height={48} alt='' className='col-2'/>
      <p className='col-2'>Hello, {name}!</p>
      <button onClick={logout} className='col-1'>logout</button>
    </div>
  );
}

const getGithubLoginCode = () => {
}

const Login = (props) => {
  const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&scope=user`;
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ githubLoginMutation ] = useMutation(GITHUB_LOGIN);

  useEffect(() => {
    if (window.location.href.match('code=')) {
      const code = window.location.search.replace('?code=', '');
      console.log(`code: ${code}`);
      githubLoginMutation({
        variables: { code },
        onCompleted: () => {
          setIsLoggedIn(true);
          window.history.pushState(null, 'GraphQL Web Service', '/');
      }});
    }
  }, []);

  if (isLoggedIn) {
    return <CurrentUser name="sample" avatar=""/>
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