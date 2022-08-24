import { useApolloClient, useMutation, useSubscription } from "@apollo/client";
import { Fragment, useCallback } from "react";
import { TableRow, TableCell, Button } from '@mui/material';

import { DELETE_COMMENT, GET_POST, SUBSCRIPTION_NEW_COMMENT, SUBSCRIPTION_NEW_DELETE_COMMENT } from '../main/operations.js';
import CommentCreate from "./CommentCreate.js";
import { dateFormat } from "../main/App";

const Comment = ({ commentData }) => {
  const client = useApolloClient();
  const [ deleteComment ] = useMutation(DELETE_COMMENT, {
    variables: { commentId: commentData._id }
  });
  const clickDeleteComment = useCallback(() => {
    deleteComment();
  }, []);
  return (
    <TableRow spacing={2} key={commentData._id}>
      <TableCell xs={2}>{commentData.commentedBy.name}</TableCell>
      <TableCell xs={8}>{commentData.content}</TableCell>
      <TableCell xs={1}>{dateFormat(commentData.created)}</TableCell>
      <TableCell xs={1}><Button variant='contained' onClick={clickDeleteComment}>X</Button></TableCell>
    </TableRow>
  )
}

const CommentList = ({ post }) => {
  const client = useApolloClient();
  useSubscription(SUBSCRIPTION_NEW_COMMENT, {
    variables: { postId: post._id },
    onSubscriptionData: ({ subscriptionData }) => {
      client.cache.updateQuery({
        query: GET_POST,
        variables: { postId: post._id }
      }, (data) => {
        const comments = [subscriptionData.data.newComment];
        data.post.comments.forEach(x => comments.push(x));
        return { post: { ...data.post, comments } };
      });
    }
  });
  useSubscription(SUBSCRIPTION_NEW_DELETE_COMMENT, {
    variables: { postId: post._id },
    onSubscriptionData: ({ subscriptionData }) => {
      client.cache.updateQuery({
        query: GET_POST,
        variables: { postId: post._id }
      }, (data) => {
        const comments = [];
        data.post.comments.forEach(comment =>
          comment._id !== subscriptionData.data.newDeleteComment && comments.push(comment));
        return { post: { ...data.post, comments }};
      })
    }
  });
  const { post: { comments }} = client.readQuery({
    query: GET_POST,
    variables: { postId: post._id }
  });
  return comments.map(comment => <Comment commentData={comment}/>);
}

const CommentWindow = ({ post }) => {
  return (
    <Fragment>
      <CommentCreate postId={post._id} />
      <CommentList post={post}/>
    </Fragment>
  );
}

export default CommentWindow;