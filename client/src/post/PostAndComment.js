import { useCallback } from "react"
import { useQuery, useMutation } from "@apollo/client";
import { Grid, Stack, ButtonGroup, Button } from '@mui/material';

import PostWindow from "./PostWindow.js";
import CommentWindow from "./CommentWindow.js";
import Score from "./Score.js";

import { VIEW_STATE } from "../main/App.js";
import { GET_POST, DELETE_POST } from '../main/operations.js';

const PostAndComment = ({ postId, setViewState }) => {
  const { loading, error, data } = useQuery(GET_POST, { 
    fetchPolicy: 'network-only',
    variables: { postId }
  });
  const [ deletePost ] = useMutation(DELETE_POST);
  const clickUpdate = useCallback(() => {
    setViewState(VIEW_STATE.UPDATE_POST);
  }, []);
  const clickDelete = useCallback(() => {
    deletePost({ variables: { postId } });
    setViewState(VIEW_STATE.MAIN);
  }, []);
  const clickCancel = useCallback(() => {
    setViewState(VIEW_STATE.MAIN);
  }, []);
  if (loading) return <p>loading...</p>
  if (error) return <p>{`Error: ${error.message}`}</p>
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Stack spacing={2}>
          <PostWindow post={data.post}/>
          <Score post={data.post} />
          <ButtonGroup>
          <Button onClick={clickCancel}>뒤로가기</Button>
            <Button onClick={clickUpdate}>수정</Button>
            <Button onClick={clickDelete}>삭제</Button>
          </ButtonGroup>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <CommentWindow post={data.post}/>
      </Grid>
    </Grid>
  );
}

export default PostAndComment;