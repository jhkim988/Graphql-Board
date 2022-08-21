import { useCallback, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { TableContainer, Table, TableHead, TableRow, TableCell, Pagination, Button } from "@mui/material";

import { ALL_POSTS, TOTAL_POSTS } from './operations.js';
import { VIEW_STATE, dateFormat } from "./App.js";

const PAGE_LIMIT = 5;

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
        <TableRow key={post._id}>
          <TableCell><p onClick={clickPost(post._id)}>{post.title}</p></TableCell>
          <TableCell>{post.postedBy.name}</TableCell>
          <TableCell>{dateFormat(post.updated)}</TableCell>
          <TableCell>{post.good}</TableCell>
        </TableRow>
        )
    })
  )
}

const Main = ({ isLoggedIn, setViewState, setPostId }) => {
  const [ page, setPage ] = useState(1);
  const totalPostsResult = useQuery(TOTAL_POSTS, { fetchPolicy: 'network-only' });
  const { loading, error, data, refetch } = useQuery(ALL_POSTS, {
    fetchPolicy: 'network-only',
    variables: { page, limit: PAGE_LIMIT }});
  const clickPostCreate = useCallback(() => {
    if (!isLoggedIn) {
      alert('로그인 해야 글 작성이 가능합니다.');
      return;
    }
    setViewState(VIEW_STATE.CREATE_POST);
  }, [isLoggedIn]);
  const paginationChange = useCallback((event, value) => {
    setPage(value);
  }, []);
  if (loading || totalPostsResult.loading) return <p>loading...</p>
  if (error) return <p>ERROR: {error.message}</p>
  if (totalPostsResult.error) return <p>Error: {totalPostsResult.error.message}</p>
  return (
    <TableContainer>
      <Table>
        <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>최종수정일</TableCell>
              <TableCell>추천</TableCell>
            </TableRow>
        </TableHead>
        <PostList data={data} setViewState={setViewState} setPostId={setPostId}/>
      </Table>
      <Pagination count={(totalPostsResult.data.totalPosts%PAGE_LIMIT === 0 ? 0 : 1) + parseInt(totalPostsResult.data.totalPosts/PAGE_LIMIT)} page={page} onChange={paginationChange}/>
      <Button onClick={clickPostCreate}>글 작성</Button>
      <Button onClick={refetch}>새로고침</Button>
    </TableContainer>
  );
}

export default Main;