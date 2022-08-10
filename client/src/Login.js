import { Fragment } from "react";

const logout = () => {

}
const CurrentUser = ({ name, avatar }) => {
  return (
    <div class='row'>
      <img src={avatar} width={48} height={48} alt='' class='col-2'/>
      <p class='col-2'>Hello, {name}!</p>
      <button onClick={logout} class='col-1'>logout</button>
    </div>
  );
}

const Login = (props) => {
  let isLoggedIn = true;
  if (isLoggedIn) {
    return <CurrentUser name="sample" avatar=""/>
  } else {
    return (
      <Fragment>
        <a href='' role='button' class='btn btn-warning'>Github 로그인</a>
        <a href='' role='button' class='btn btn-success'>Naver 로그인</a>
        <a href='' role='button' class='btn btn-danger'>Google 로그인</a>
      </Fragment>
    );
  }
}

export default Login;