import { useCallback, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Stack, ButtonGroup, Button, TextField } from '@mui/material'

import { GET_POST, UPDATE_POST } from "../operations";
import { VIEW_STATE } from "../App";

const PostUpdateWindow = ({ postId, setViewState }) => {
  const [ file, setFile ] = useState();
  const { loading, error, data: post } = useQuery(GET_POST, { 
    fetchPolicy: 'network-only',
    variables: { postId },
    onCompleted: ({ post }) => {
      setPostInfo({ title: post?.title, content: post?.content, photo: post?.photo});
    }
  });
  const [ postInfo, setPostInfo ] = useState({ title: post?.title, content: post?.content, photo: post?.photo});
  const [ updatePost ] = useMutation(UPDATE_POST);
  const clickUpdate = useCallback(() => {
    updatePost({
      variables: {
        postId: postId,
        postInfo: postInfo,
    }});
    setViewState(VIEW_STATE.VIEW_POST);
  }, [postInfo]);
  const clickCancel = useCallback(() => {
    setViewState(VIEW_STATE.MAIN);
  }, []);
  const onChange = useCallback(e => {
    setPostInfo({
      ...postInfo,
      [e.target.name]: e.target.value
    })
  }, [postInfo]);
  const onChangeFile = e => {
    const { target: { validity, files: [file]}} = e;
    validity ? setFile(file) : setFile(null);
  }
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: ${error.message}</p>
  return (
    <Stack spacing={2}>
    <h3>게시물 수정</h3>
    <div>
      <TextField id='standard-basic' sx={{ width: '80%' }} name="title" value={postInfo.title} onChange={onChange} placeholder="글 제목을 입력하세요"/> 
    </div>
    <div>
      <TextField id='filled-multiline-static' multiline sx={{ width: '80%' }} name="content" value={postInfo.content} onChange={onChange} placeholder="글 내용을 입력하세요" />
    </div>
    <div>
      <input type='file' value={postInfo.photo} onChange={onChangeFile} accept='image/jpeg, image/png' alt=''/>
    </div>
    <div>
      <ButtonGroup>
        <Button onClick={clickCancel} type='button'>취소</Button>
        <Button onClick={clickUpdate} type='button'>등록</Button>
      </ButtonGroup>
    </div>
  </Stack>
  )
}

export default PostUpdateWindow;