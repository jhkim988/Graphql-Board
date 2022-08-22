import { ButtonGroup, Button } from '@mui/material'
import { useState } from 'react';
import { useMutation, useSubscription, useApolloClient } from '@apollo/client';
import { ADD_BAD, ADD_GOOD, SUBSCRIPTION_ADD_GOOD, SUBSCRIPTION_ADD_BAD, GET_POST } from '../main/operations';

const Score = ({ post }) => {
  const client = useApolloClient();
  const [ good, setGood ] = useState(post.good);
  const [ bad, setBad ] = useState(post.bad);
  const [ addGood, addGoodResult ] = useMutation(ADD_GOOD);
  const [ addBad, addBadResult ] = useMutation(ADD_BAD);
  useSubscription(SUBSCRIPTION_ADD_GOOD, {
    variables: { postId: post._id },
    onSubscriptionData: ({ subscriptionData }) => {
      client.cache.updateQuery({
        query: GET_POST,
        variables: { postId: post._id },
      }, (data) => ({
        ...data,
        good: subscriptionData.data.newAddGood.good
      }));
      setGood(subscriptionData.data.newAddGood.good);
    }
  });
  useSubscription(SUBSCRIPTION_ADD_BAD, {
    variables: { postId: post._id },
    onSubscriptionData: ({ subscriptionData }) => {
      client.cache.updateQuery({
        query: GET_POST,
        variables: { postId: post._id },
      }, (data) => ({
        ...data,
        bad: subscriptionData.data.newAddBad.bad
      }));
      setBad(subscriptionData.data.newAddBad.bad);
    }
  })
  if (addGoodResult.error || addBadResult.error) {
    alert(addGoodResult.error || addBadResult.error);
  }
  const goodClick = () => {
    addGood({ variables: { postId: post._id }});
  }
  const badClick = () => {
    addBad({ variables: { postId: post._id }});
  }
  return (
    <ButtonGroup>
      <Button onClick={goodClick}>Good: {good}</Button>
      <Button onClick={badClick}>Bad: {bad}</Button>
    </ButtonGroup>
  )
}

export default Score;