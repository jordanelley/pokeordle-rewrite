import pokeLogo from './Images/pokeordle.png';
import './App.css';
import Form from "./Components/Form";
import {useState} from "react";

function App() {

    const [solved, setSolved] = useState(false)
    const [addNewForm, setAddNewForm] = useState(false)

    const form = <Form solved= {setSolved} guessAgain={setAddNewForm} />
    const [ guessPrompt, setGuessPrompt ] = useState([form])

    const congrats = <div> Congrats you have guessed the pokemon </div>

    if(addNewForm){

        setAddNewForm(false)
        setGuessPrompt(guessPrompt.concat([form]))
    }

  return (
    <div className="App">
      <header className="App-header">
        <img src={pokeLogo} className="App-logo" alt="logo" />
      </header>
        {guessPrompt}
        {solved && congrats}
    </div>
  );
}

export default App;
