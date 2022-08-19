import { Fragment, useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_POSTS, ME } from './operations.js';
import { VIEW_STATE  } from "./App.js";

const dateFormat = str => {
  const date = new Date(str);
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}

const PostList = ({ data, setViewState, setPostId }) => {
  const clickPost = useCallback((id) => {
    return () => {
      setPostId(id);
      setViewState(VIEW_STATE.VIEW_POST);
    }
  }, []);
  return (
    data.allPosts.map(post => {
      return (
        <tr key={post._id}>
          <th><p onClick={clickPost(post._id)}>{post.title}</p></th>
          <th>{post.postedBy.name}</th>
          <th>{dateFormat(post.updated)}</th>
          <th>{post.good}</th>
        </tr>
        )
    })
  )
}

const Main = ({ setViewState, setPostId }) => {
  const { loading, error, data, refetch } = useQuery(ALL_POSTS,
    { fetchPolicy: 'network-only' },
    { variabels: { page: 1, limit: 5 }});
  const meQuery = useQuery(ME);
  const clickPostCreate = useCallback(() => {
    if (!meQuery.data?.me) {
      alert('로그인 해야 글 작성이 가능합니다.');
      return;
    }
    setViewState(VIEW_STATE.CREATE_POST);
  }, []);
  if (loading) return <p>loading...</p>
  if (error) return <p>ERROR: {error.message}</p>
  return (
    <Fragment>
      <table>
        <tr>
          <th>제목</th>
          <th>작성자</th>
          <th>최종수정일</th>
          <th>추천</th>
        </tr>
        <tbody>
          <PostList data={data} setViewState={setViewState} setPostId={setPostId}/>
        </tbody>
      </table>
      <button onClick={clickPostCreate}>글 작성</button>
      <button>pagination</button>
    </Fragment>
  );
}

export default Main;