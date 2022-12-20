import React, {useEffect, useState} from "react";
import {getMoves, getDamageInfoOnMove, getPokemonByIndex, getAllPokemon} from "../apiCalls";
import { FormStateEnum } from "../formstate.enum"
import cross from "../Images/cross.png"

import '../App.css'

function Form(props){

    const [pokeSelection, setPokeSelection] = useState('');
    const [moveSelection, setMoveSelection] = useState('')

    const [moveDropdownOption, setMoveDropdownOption] = useState([])

    const [formState, setFormState] = useState(FormStateEnum.noGuesses)
    const [damageState, setDamageState] = useState("")
    const [typeCorrect, setTypeCorrect] = useState(false)

    const [dailyPokemon, setDailyPokemon] = useState({})
    const [allPokemon, setAllPokemon] = useState([])


    async function turnDateIntoUniquePokemon(){
        const date = new Date().toLocaleDateString(); 
        const number = parseInt(date.replaceAll("/",""));
        const index = Math.floor(number/62245);
        return getPokemonByIndex(index);
    }

    useEffect(() => {
        const fetchData = async () => {
            const dailyPokemon = await turnDateIntoUniquePokemon();
            const allPokemon = await getAllPokemon();
            setDailyPokemon(dailyPokemon);
            setAllPokemon(['please select'].concat(allPokemon))
        }
        fetchData()
            .catch(console.error);
    }, [])

    const incorrectGuessCross = <img src={cross} id="cross"/>

    const selectMove = <div className="user-inputs">
        <label>
            pick a move
            <select  onChange={handleMoveSelection} value={moveSelection}>
                {moveDropdownOption.map((options) => (
                    <option value={options.value}>{options.label}</option>
                ))}
            </select>
        </label>
        <button onClick={onSelectMove}> go </button>
    </div>


    const damageClue = <div>This move was {damageState} against the target pokemon</div>

    async function handleChange(event) {
       setPokeSelection(event.target.value.toLowerCase())
    }

    async function handleMoveSelection(event){
        setMoveSelection(event.target.value);

    }
    
    const correctTypeClue = () => <div> The Pokemon you choose has the correct type. {dailyPokemon? dailyPokemon.types.length > 1? "Although the pokemon has more than 1 type": "" : ""} </div>

    function findDamageOnDailyPokemon(damageRelations) {
        const keysToReturn = []
        const keysToSearch = ["double_damage_to", "no_damage_to", "half_damage_to"]
        keysToSearch.map(key => {
           damageRelations[key].map(
               damageRelation => {
                dailyPokemon.types.map(type => {
                    if(type === damageRelation.name){
                        keysToReturn.push(key);
                    }
                })
           })
        })
        return keysToReturn;
    }

    async function onSelectMove(){
        const response = await getDamageInfoOnMove(moveSelection);
        const damageRelations = findDamageOnDailyPokemon(response);
        props.guessAgain(true);
        if(damageRelations.length === 0){
            setDamageState("regular effectiveness");
            return
        }
        if(damageRelations.includes("double_damage_to")){
            setDamageState("super effective");
            return
        }
        if(damageRelations.includes("no_damage_to")){
            setDamageState("not damaging at all to");
            return
        }
        if(damageRelations.includes("half_damage_to")){
            setDamageState("not very effective");
        }
    }

    async function onMakeGuess(){
        const response = await getMoves(pokeSelection)

        setMoveDropdownOption([{label: 'Please Select'}].concat(response.map(x => {return {label: x, value: x}})))
        if(pokeSelection === dailyPokemon.name){
            setFormState(FormStateEnum.correctGuess)
            props.solved(true)
        }
        else {
            setFormState(FormStateEnum.incorrectGuess)
            const isCorrect = await isTypeCorrect();
            setTypeCorrect(isCorrect);

            if(isCorrect) {
                 props.guessAgain(true)
             }
        }
    }
    
    async function isTypeCorrect(){
        const guessedPokemonTypes = (await getPokemonByIndex(pokeSelection)).types
        const isSameType = guessedPokemonTypes.some(element => {
            return dailyPokemon.types.includes(element);
        });
        return isSameType;
    }

    const letterClue = <div> Pokemon begins with {dailyPokemon.name? dailyPokemon.name[0] :""}</div>

    const selectPokemon2 = (allPokemon) =>
        <label>
        guess a pokemon
        <select  onChange={handleChange} >
            {allPokemon.map((options) => (
                <option value={options}>{options}</option>
            ))}
        </select>
        <button onClick={onMakeGuess}> make guess </button>
    </label>

    return  <div className='guess-component'>
        {formState===FormStateEnum.noGuesses? selectPokemon2(allPokemon) : pokeSelection}
        {pokeSelection && formState===FormStateEnum.incorrectGuess && incorrectGuessCross}
        {!typeCorrect? pokeSelection && formState===FormStateEnum.incorrectGuess && !damageState? selectMove: moveSelection : ""}

        {typeCorrect && correctTypeClue()}
        {typeCorrect && letterClue}
        {damageState && moveSelection && damageClue}
    </div>

}

export default Form;
