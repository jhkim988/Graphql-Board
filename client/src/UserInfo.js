import { useCallback } from 'react';
import { useApolloClient } from "@apollo/client";
import { ME } from './operations.js';

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
    <div className='row'>
      <img src={meQueryData.me.avatar} width={48} height={48} alt='' className='col-2'/>
      <p className='col-2'>Hello, {meQueryData.me.name}!</p>
      <button onClick={logout} className='col-1'>logout</button>
    </div>
  );
}

export default UserInfo;