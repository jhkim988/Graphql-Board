import { useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { CREATE_POST, CREATE_PHOTO } from '../main/operations.js'
import { VIEW_STATE } from "../main/App.js";
import { TextField, ButtonGroup, Button } from '@mui/material';
import { Stack } from "@mui/system";

const PostCreateWindow = ({ setViewState }) => {
  const [ postInfo, setPostInfo ] = useState({ title: null, content: null, photo: null });
  const [ file, setFile ] = useState();
  const [ createPost, createPostResult ] = useMutation(CREATE_POST);
  const [ createPhoto, createPhotoResult ] = useMutation(CREATE_PHOTO, {
    onCompleted: (data) => {
      setFile({ ...file, name: data.createPhoto.filename});
    }
  });
  const onChange = useCallback(e => {
    setPostInfo({
      ...postInfo,
      [e.target.name]: e.target.value
    })
  }, [postInfo]);
  const onChangeFile = useCallback(async e => {
    const { target: { validity, files: [file]}} = e;
    validity ? setFile(file) : setFile(null);
    await createPhoto({ variables: { file }, context: { headers: {'apollo-require-preflight': 'true'}}});
    if (createPhotoResult.error) {
      alert(`Create Photo Error: ${createPhotoResult.error.message}`);
    }
  }, []);

  const clickCancel = useCallback(() => {
    setViewState(VIEW_STATE.MAIN);
  }, []);
  const clickCreate = async () => {
    await createPost({ variables: { postInfo: { ...postInfo, photo: file ? file.name : undefined }}});
    if (createPostResult.error) {
      alert(`Create Post Error: ${createPostResult.error.message}`);
    }    
    setViewState(VIEW_STATE.MAIN);
    alert('글이 등록되었습니다.');
  }

  return (
    <Stack spacing={2}>
      <h3>게시물 작성</h3>
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
          <Button onClick={clickCancel} type='button'>뒤로가기</Button>
          <Button onClick={clickCreate} type='button'>등록</Button>
        </ButtonGroup>
      </div>
    </Stack>
  )
}

export default PostCreateWindow;