import { useMutation } from "@apollo/client";
import { Fragment } from "react";
import { DELETE_COMMENT } from '../operations.js';

const Comment = (props) => {
  // const [ deleteFuntion ] = useMutation(DELETE_COMMENT, { variables: { commentId: props.commentData_id }});
  return (
    <Fragment>
    <p>d.commentedBy.name</p>
    <p>d.content</p>
    <p>created</p>
    <button>삭제</button>
  </Fragment>
  )
}

const CommentList = (props) => {
  return props.data.map(d => <Comment commentData={d}/>);
}

const CommentWindow = (props) => {
  return <CommentList data={props.commentsList}/>
}

export default CommentWindow;