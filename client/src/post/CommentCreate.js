import { useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { Grid, TextField, Button } from '@mui/material';

import { CREATE_COMMENT } from "../main/operations";

const CommentCreate = ({ postId }) => {
  const [ content, setContent ] = useState('');
  const [ createComment ] = useMutation(CREATE_COMMENT);
  const commentInputChange = useCallback(e => {
    setContent(e.target.value);
  }, [])
  const clickCommentAdd = useCallback(() => {
    createComment({ variables: { postId, content }});
    setContent('');
  }, [content]);
  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <TextField sx={{ width: '100%' }} value={content} onChange={commentInputChange} placeholder="댓글을 입력하세요"/>
      </Grid>
      <Grid item xs={2}>
        <Button variant='contained' onClick={clickCommentAdd}>입력</Button>
      </Grid>
    </Grid>
  )
}

export default CommentCreate;