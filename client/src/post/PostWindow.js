import { Fragment } from "react";

const PostWindow = ({ post }) => {
  return (
    <div>
      <div className='form-control'>{post.title}</div>
      <div className='form-control'>{post.content}</div>
    </div>
  )
}

export default PostWindow;