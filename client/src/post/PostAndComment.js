import { Fragment, useState } from "react"
import { useQuery, useMutation } from "@apollo/client";
import PostWindow from "./PostWindow.js";
import CommentWindow from "./CommentWindow.js";
import PostUpdateWindow from './PostUpdateWindow.js'
import Score from "./Score.js";
import { GET_POST, UPDATE_POST, DELETE_POST } from '../operations.js';

const PostAndComment = ({ postId }) => {
  const [ isUpdateWindow, setIsUpdateWindow ] = useState(false);
  const [ postInfo, setPostInfo ] = useState({});
  const { loading, error, data, refetch } = useQuery(GET_POST, { variables: { postId }});

  const [ deletePost ] = useMutation(DELETE_POST);
  // const [ score, setScore ] = useState({ good: data?.good || 0, bad: data?.bad || 0 });
  // if (loading) return <p>Loading...</p>
  // if (error) return <p>Error {error.message}</p>

  const update = () => {
    setIsUpdateWindow(true);
  }

  if (loading) return <p>loading...</p>
  if (error) return <p>{`Error: ${error.message}`}</p>
  console.log(data);
  return (
    <div className='col-md-12'>
      <div className='col-md-4'>
        {
          isUpdateWindow
          ? <PostUpdateWindow post={data.post}/>
          : <PostWindow post={data.post}/>
        }
        {
          // buttons
          isUpdateWindow ||
          (<Fragment>
            <Score />
            <div className='row'>
              <button onClick={update} className='col-md-2 btn btn-primary'>수정</button>
              <button className='col-md-2 btn btn-danger'>삭제</button>
            </div>
            </Fragment>
          )
        }
      </div>
      <div className='col-md-2'>

      </div>
    </div>
  )
}

export default PostAndComment;