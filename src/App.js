import './App.css';
import Board from './components/Board';
import api from './services/api';

function App() {
  const columns = api.getColumns();
  const cards = api.getCards();
  return (
    <div className="App">
      <Board 
        columns={ columns } 
        cards={ cards } 
      />
    </div>
  );
}

export default App;
