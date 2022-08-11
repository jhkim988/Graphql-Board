import { Fragment, useState } from "react"
import { gql, useQuery, useMutation } from "@apollo/client";
import PostWindow from "./PostWindow.js";
import CommentWindow from "./CommentWindow.js";
import PostUpdateWindow from './PostUpdateWindow.js'
import Score from "./Score.js";

const GET_POST = gql`
  query(postId: $ID) {
    post(postId: $postId) {
      title
      content
      photo
      good
      bad
      poastedBy {
        name
      }
      comments {
        _id
        commentedBy {
          name
        }
        content
        created
      }
      created
      updated
    }
  }
`
const UPDATE_POST = gql`
  mutation($postId: ID!, $postInfo: postInfo) {
    updatePost(postId: $postId, postInfo: $postInfo)
  }
`
const DELETE_POST = gql`
  mutation(postId: ID!) {
    deletePost(postId: $postId)
  }
`

const PostAndComment = (props) => {
  const [ isUpdateWindow, setIsUpdateWindow ] = useState(false);
  const [ postInfo, setPostInfo ] = useState({});
  const { loading, error, data, refetch } = useQuery(GET_POST, { variables: { postId: props.postId}});
  const [ updatePost ] = useMutation(UPDATE_POST,
    {
      variables: {
      postId: props.postId,
      postInfo: postInfo,
    }
  });
  const [ deletePost ] = useMutation(DELETE_POST);
  const [ score, setScore ] = useState({ good: data.good, bad: data.bad});
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error {error.message}</p>
  return (
    <Fragment>
      {
      isUpdateWindow
        ? <PostUpdateWindow setPostInfo={setPostInfo} setIsUpdateWindow={setIsUpdateWindow} updatePost={updatePost}/>
        : <PostWindow data={data} />
      }
      <CommentWindow commentsList={data.comments}/>
      <Score good={data.good} bad={data.bad} setScore={setScore}/>
      {
        isUpdateWindow && (
        <Fragment>
          <button onClick={() => setIsUpdateWindow(!isUpdateWindow)}>수정</button> 
          <button onClick={deletePost}>삭제</button>
          <button onClick={refetch}>새로고침</button>
        </Fragment>
        )
      }

    </Fragment>
  )
}

export default PostAndComment;