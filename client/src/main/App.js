import { Fragment, useState } from 'react';
import { useQuery } from '@apollo/client';
import '../App.css';
import Main from './Main.js';
import Login from './Login.js';
import UserInfo from './UserInfo.js';

import { ME } from './operations';

import PostAndComment from '../post/PostAndComment.js';
import PostUpdateWindow from '../post/PostUpdateWindow';
import PostCreateWindow from '../post/PostCreateWindow';

export const VIEW_STATE = {
  MAIN: 'main',
  VIEW_POST: 'view_post',
  UPDATE_POST: 'update_post',
  CREATE_POST: 'create_post',
}
export const dateFormat = str => {
  const date = new Date(str);
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}
const App = () => {
  // Login Status, View Status
  const meQuery = useQuery(ME);
  const [ isLoggedIn, setIsLoggedIn ] = useState(meQuery.data?.me != null);
  const [ viewState, setViewState ] = useState(VIEW_STATE.MAIN);
  const [ postId, setPostId ] = useState(0);

  return (
    <Fragment>
      <a href='/'><h1>GraphQL Web Service</h1></a>
      {
        // Login/UserInfo:
        meQuery.errors
          ? <p>LoginStatus Error: {meQuery.errors}</p>
        : meQuery.loading
          ? <p>LoginStatus Loading</p>
        : isLoggedIn
          ? <UserInfo setIsLoggedIn={setIsLoggedIn} meQueryData={meQuery.data}/>
          : <Login setIsLoggedIn={setIsLoggedIn}/>
      } 
      {
        // view:
        viewState === VIEW_STATE.MAIN
          ? <Main isLoggedIn={isLoggedIn} setViewState={setViewState} setPostId={setPostId} />
        : viewState === VIEW_STATE.VIEW_POST
          ? <PostAndComment postId={postId} setViewState={setViewState} />
        : viewState === VIEW_STATE.UPDATE_POST
          ? <PostUpdateWindow postId={postId} setViewState={setViewState}/>
        : viewState === VIEW_STATE.CREATE_POST
          ? <PostCreateWindow setViewState={setViewState}/>
        : <p>Wrong State</p>
      }
    </Fragment>
    );
}

export default App;
