import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";

const CREATE_POST = gql`
  mutation createPost($postInfo: PostInfo!) {
    createPost(postInfo: $postInfo) {
      title
    }
  }
`

const PostCreateWindow = ({ setViewState }) => {
  const clickCancel = () => {
    setViewState('main');
  }
  const clickCreate = () => {

  }
  const [ createPost, { error } ] = useMutation(CREATE_POST, {
    variables: {
      postInfo: {
        title: 'TODO',
        content: 'CONTENT',
        // photo: 'PHOTO',
      }
    }
  });
  
  return (
    <Fragment>
      <h3>게시물 작성</h3>
      <div class='col-md-12'>
        <div class='col-md-4'>
          <input className='form-control' type='text' placeholder="글 제목을 입력하세요"/>
          <textarea className='form-control' type='textarea' placeholder="글 내용을 입력하세요" />
          <input className='form-control' type='file' accept='image/jpeg, image/png' alt=''/>
          <button onClick={clickCancel} type='button' class='btn btn-secondary'>취소</button>
          <button onClick={clickCreate} type='button' class='btn btn-primary'>등록</button>
        </div>
      </div>
    </Fragment>
  )
}

export default PostCreateWindow;