import { useCallback } from 'react';
import { useApolloClient } from "@apollo/client";
import { Grid, Button } from '@mui/material';

import { ME } from '../main/operations.js';

const UserInfo = ({ setIsLoggedIn, meQueryData }) => {
  const client = useApolloClient();
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('login');
    localStorage.removeItem('loginType');
    client.writeQuery({ query: ME, data: { me: null }});
    setIsLoggedIn(false);
  }, []);
  return (
    <Grid container>
      <Grid item xs={2}>
        <img src={meQueryData.me.avatar} width={48} height={48} alt='' className='col-2'/>
      </Grid>
      <Grid item xs={2}>
        <p className='col-2'>Hello, {meQueryData.me.name}!</p>
      </Grid>
      <Grid item xs={2}>
        <Button onClick={logout} className='col-1'>logout</Button>
      </Grid>
    </Grid>
  );
}

export default UserInfo;