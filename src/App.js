import { useState } from 'react';
import './App.css';
import Board from './components/Board';
import LoginScreen from './components/Login';

function App() {
  let [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <div className="app">
      {isAuthenticated ?
        <Board/> :
        <LoginScreen onSuccessfulLogin={() => setIsAuthenticated(true)}/>
      }
    </div>
  );
}

export default App;
