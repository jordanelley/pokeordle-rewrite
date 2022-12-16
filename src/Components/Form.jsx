import React, {useEffect, useState} from "react";
import {getMoves, getDamageInfoOnMove, getPokemonByIndex} from "../apiCalls";
import { FormStateEnum } from "../formstate.enum"


function Form(props){

    const [pokeSelection, setPokeSelection] = useState('');
    const [moveSelection, setMoveSelection] = useState('')

    const [moveDropdownOption, setMoveDropdownOption] = useState([])

    const [formState, setFormState] = useState(FormStateEnum.noGuesses)
    const [damageState, setDamageState] = useState("")
    const [typeCorrect, setTypeCorrect] = useState(false)

    const [dailyPokemon, setDailyPokemon] = useState({})


    async function turnDateIntoUniquePokemon(){
        const date = new Date().toLocaleDateString(); 
        const number = parseInt(date.replaceAll("/",""));
        const index = Math.floor(number/62245);
        return getPokemonByIndex(index);
    }


    useEffect(() => {
        const fetchData = async () => {
            const data = await turnDateIntoUniquePokemon();
            setDailyPokemon(data);
        }
        fetchData()
            .catch(console.error);
    }, [])


    const selectMove = <div>
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

    const incorrectGuessCross = <span> X incorrect guess </span>

    const damageClue = <div>This move was {damageState} against the target pokemon</div>

    async function handleChange(event) {
       setPokeSelection(event.target.value.toLowerCase())
    }

    async function handleMoveSelection(event){
        setMoveSelection(event.target.value);

    }
    
    const correctTypeClue = <div> The Pokemon you choose has the correct type </div>

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
            await isTypeCorrect();
        }
    }
    
    async function isTypeCorrect(){
        const guessedPokemonTypes = (await getPokemonByIndex(pokeSelection)).types
        const isSameType = guessedPokemonTypes.some(element => {
            return dailyPokemon.types.includes(element);
        });
        setTypeCorrect(isSameType);
    }

    const selectPokemon =<label>
        Pokemon:
        <input type="text" name="name" onChange={handleChange}/>
        <button onClick={onMakeGuess}> make guess </button>
    </label>

    return  <div >
        {selectPokemon}
        {pokeSelection && formState===FormStateEnum.incorrectGuess && incorrectGuessCross}
        {pokeSelection && formState===FormStateEnum.incorrectGuess && selectMove}
        {typeCorrect && correctTypeClue}
        {damageState && moveSelection && damageClue}
    </div>

}

export default Form;
