import { useState } from 'react';
import api from '../services/api';

export default function LoginScreen({ onSuccessfulLogin }) {
  let [username, setUsername] = useState('');
  let [password, setPassword] = useState('');
  let [failedLogin, setFailedLogin] = useState(false);

  function authenticate() {
    console.log('login clicked');
    if (api.authenticate(username, password)) {
      console.log('Successful login!');
      onSuccessfulLogin();
    } else {
      console.log('Failed login!');
      setFailedLogin(true);
    }
  }

  return (
    <div className='login-screen'>
      <div className='login-form'>
        <label>Username</label>
        <input onChange={(e) => setUsername(e.target.value)}/>
        <label>Password</label>
        <input onChange={(e) => setPassword(e.target.value)} />
        <div style={{ height: '16px' }}></div>
        <button className='button-primary' onClick={authenticate}>Login</button>
        <button className='button-primary'>Create Account</button>
        {
          failedLogin ? <span style={{ color: 'darkred' }}>Username or password are incorrect.</span> : <></>
        }
      </div>
    </div>
  );
}
