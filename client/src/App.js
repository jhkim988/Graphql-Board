import { Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Main.js';
import Login from './Login.js';

function App() {
  return (
    <Fragment>
    <a href='/'><h1>GraphQL Web Service</h1></a>
    <Login />
    <Main />
    </Fragment>
    );
}

export default App;