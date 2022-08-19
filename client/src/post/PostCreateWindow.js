import { useMutation } from "@apollo/client";
import { Fragment, useState } from "react";
import { CREATE_POST, CREATE_PHOTO } from '../operations.js'

const PostCreateWindow = ({ setViewState }) => {
  const [ postInfo, setPostInfo ] = useState({ title: null, content: null, photo: null });
  const [ file, setFile ] = useState();
  const [ createPost, createPostResult ] = useMutation(CREATE_POST);
  const [ createPhoto, createPhotoResult ] = useMutation(CREATE_PHOTO);
  const onChange = e => {
    setPostInfo({
      ...postInfo,
      [e.target.name]: e.target.value
    })
  }
  const onChangeFile = e => {
    const { target: { validity, files: [file]}} = e;
    validity ? setFile(file) : setFile(null);
  }

  const clickCancel = () => {
    setViewState('main');
  }
  const clickCreate = () => {
    if (file) {
      createPhoto({ variables: { file }, context: { headers: {'apollo-require-preflight': 'true'}}});
      if (createPhotoResult.error) {
        alert(`Create Photo Error: ${createPhotoResult.error.message}`);
      }
    }
    createPost({ variables: { postInfo: { ...postInfo, photo: createPhotoResult?.data?.filename }}});
    if (createPostResult.error) {
      alert(`Create Post Error: ${createPostResult.error.message}`);
    }
    setViewState('main');
    alert('글이 등록되었습니다.');
  }

  return (
    <Fragment>
      <h3>게시물 작성</h3>
      <div className='col-md-12'>
        <div className='col-md-4'>
          <input type='text' name='title' value={postInfo.title} onChange={onChange} className='form-control'  placeholder="글 제목을 입력하세요"/>
          <textarea type='textarea' name='content' value={postInfo.content} onChange={onChange} className='form-control'  placeholder="글 내용을 입력하세요" />
          <input type='file' value={postInfo.photo} onChange={onChangeFile} className='form-control' accept='image/jpeg, image/png' alt=''/>
          <button onClick={clickCancel} type='button' className='btn btn-secondary'>취소</button>
          <button onClick={clickCreate} type='button' className='btn btn-primary'>등록</button>
        </div>
      </div>
    </Fragment>
  )
}

export default PostCreateWindow;