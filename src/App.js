import pokeLogo from './Images/pokeordle.png';
import pikachu from './Images/pikachu.png'
import './App.css';
import Form from "./Components/Form";
import {useEffect, useState} from "react";

function App() {

    const [solved, setSolved] = useState(false);
    const [addNewForm, setAddNewForm] = useState(false);

    const form = <Form solved= {setSolved} guessAgain={setAddNewForm} />
    const [ guessPrompt, setGuessPrompt ] = useState([form])

    useEffect(() => {
        document.title = 'pokeordle'
    }, [])

    const congrats = <div id="congrats"> Congrats you have guessed the pokemon </div>

    if(addNewForm){

        setAddNewForm(false)
        setGuessPrompt(guessPrompt.concat([form]))
    }

  return (
    <div className="App">
      <header className="App-header">
        <img src={pokeLogo} id="title-image" className="title-image"/>
        <img src={pikachu} id="pikachu-image"  className="title-image"/>
      </header>
        <div className="body">
            {guessPrompt}
            {solved && congrats}
        </div>
    </div>
  );
}

export default App;
