import pokeLogo from './Images/pokeordle.png';
import './App.css';
import Form from "./Components/Form";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={pokeLogo} className="App-logo" alt="logo" />
      </header>
        <Form/>
    </div>
  );
}

export default App;
