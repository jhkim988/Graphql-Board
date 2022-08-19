import { Fragment, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_POST } from "../operations";

const PostUpdateWindow = ({ post, setIsUpdateWindow }) => {
  const [ updatePost ] = useMutation(UPDATE_POST,{
    variables: {
      postId: post._id,
      postInfo: postInfo,
  }});
  const clickUpdate = () => {
    updatePost(postInfo);
    setIsUpdateWindow(false);
  }
  const clickCancel = () => {
    setIsUpdateWindow(false);
  }
  const [ postInfo, setPostInfo ] = useState({title: post.title, content: post.content, photo: post?.photo});
  const onChange = e => {
    setPostInfo({
      ...postInfo,
      [e.target.name]: e.target.value
    })
  }
  const onChangeFile = e => {
    const { target: { validity, files: [file]}} = e;
    // validity ? setFile(file) : setFile(null);
  }
  return (
    // <form>
    //   <input type='text'/>
    //   <img type='file' accept='image/jpeg, image/png' alt=''/>
    //   <input type='textarea'></input>
    //   <button onClick={updateDone}>수정완료</button>
    //   <button obClick={updateCancle}>취소</button>
    // </form>
    <Fragment>
      <h3>게시글 수정</h3>
      <div className='col-md-12'>
        <div className='col-md-4'>
          <input type='text' name='title' value={postInfo.title} onChange={onChange} className='form-control'  placeholder="글 제목을 입력하세요"/>
          <textarea type='textarea' name='content' value={postInfo.content} onChange={onChange} className='form-control'  placeholder="글 내용을 입력하세요" />
          <input type='file' value={postInfo.photo} onChange={onChangeFile} className='form-control' accept='image/jpeg, image/png' alt=''/>
          <button onClick={clickCancel} type='button' className='btn btn-secondary'>취소</button>
          <button onClick={clickUpdate} type='button' className='btn btn-primary'>수정완료</button>
        </div>
      </div>
    </Fragment>
  )
}

export default PostUpdateWindow;