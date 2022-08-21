import { useMutation } from "@apollo/client";
import { Fragment, useCallback } from "react";
import { TableRow, TableCell, Button } from '@mui/material';

import { DELETE_COMMENT } from '../operations.js';
import CommentCreate from "./CommentCreate.js";
import { dateFormat } from "../App";

const Comment = ({ commentData }) => {
  const [ deleteComment ] = useMutation(DELETE_COMMENT, {
    variables: { commentId: commentData._id }
  });
  const clickDeleteComment = useCallback(() => {
    deleteComment();
  }, []);
  return (
    <TableRow spacing={2}>
      <TableCell xs={2}>{commentData.commentedBy.name}</TableCell>
      <TableCell xs={8}>{commentData.content}</TableCell>
      <TableCell xs={1}>{dateFormat(commentData.created)}</TableCell>
      <TableCell xs={1}><Button variant='contained' onClick={clickDeleteComment}>X</Button></TableCell>
    </TableRow>
  )
}

const CommentList = ({ data }) => {
  return data.map(comment => <Comment commentData={comment}/>);
}

const CommentWindow = ({ post }) => {
  return (
    <Fragment>
      <CommentCreate postId={post._id} />
      <CommentList data={post.comments}/>
    </Fragment>
  );
}

export default CommentWindow;