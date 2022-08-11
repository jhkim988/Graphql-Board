import { gql, useQuery, useMutation } from "@apollo/client";
import { Fragment } from "react";

const GET_COMMENT_LIST = gql`
  query getCommentList(postId: $ID!) {
    allComment(postId: $postId) {
      _id
      commentedBy {
        name
      }
      content
      created
    }
  }
`
const DELETE_COMMENT = gql`
  mutation($commentId: ID!) {
    deleteComment(commentId: $commentId)
}
`
const Comment = (props) => {
  const [ deleteFuntion ] = useMutation(DELETE_COMMENT, { variables: { commentId: props.commentData_id }});
  return (
    <Fragment>
    <p>d.commentedBy.name</p>
    <p>d.content</p>
    <p>created</p>
    <button onClick={deleteFuntion}>삭제</button>
  </Fragment>
  )
}

const CommentList = (props) => {
  return props.data.map(d => <Comment commentData={d}/>);
}

const CommentWindow = (props) => {
  const { loading, error, data, refetch } = useQuery(GET_COMMENT_LIST, { variables: { postId: props.postId }});
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error {error.message}</p>
  return (
    <Fragment>
      <button onClick={refetch}>댓글 새로고침</button>
      <CommentList data={data}/>
    </Fragment>
  )
}

export default CommentWindow;