import React, { useState } from "react";
import {getMoves, getDamageInfoOnMove} from "../apiCalls";
import { FormStateEnum } from "../formstate.enum"
import { DamageStateEnum } from "../damagestate.enum";


function Form(){
    const [pokeSelection, setPokeSelection] = useState('');
    const [moveSelection, setMoveSelection] = useState('')

    const [moveDropdownOption, setMoveDropdownOption] = useState([])
    const [moveDamageResponse, setMoveDamageResponse] = useState([])

    const [formState, setFormState] = useState(FormStateEnum.noGuesses)
    const [damageState, setDamageState] = useState(DamageStateEnum.unknown)

    const dailyPokemon = "Combusken"
    const dailyPokemonType = "fire"

    const selectMove = <div>
        <label>
            pick a move
            <select  onChange={handleMoveSelection}>
                {moveDropdownOption.map((options) => (
                    <option value={options.value}>{options.label}</option>
                ))}
            </select>
        </label>
        <button onClick={onSelectType}> go </button>
    </div>

    const incorrectGuessCross = <span> X </span>

    async function handleChange(event) {
       setPokeSelection(event.target.value)
        const response = await getMoves(event.target.value)
        setMoveDropdownOption(response.map(x => {return {label: x, value: x}}))
    }

    async function handleMoveSelection(event){
        setMoveSelection(event.target.value);
        const response = await getDamageInfoOnMove(event.target.value)
        console.log(response)
    }

    function findDamageOnDailyPokemon(damageRelations){
        const keysToSearch = ["double_damage_to", "half_damage_to", "no_damage_to"]
        keysToSearch.map(key => {
           damageRelations.key.map({

           })
        })
    }

    function onSelectType(){

    }

    function onMakeGuess(){
        if(pokeSelection === dailyPokemon){
            setFormState(FormStateEnum.correctGuess)
        }
        else {
            setFormState(FormStateEnum.incorrectGuess)
        }
    }

    const selectPokemon =<label>
        Pokemon:
        <input type="text" name="name" onChange={handleChange}/>
        <button onClick={onMakeGuess}> make guess </button>
    </label>


    return <form>
        {selectPokemon}
        {pokeSelection && formState===FormStateEnum.incorrectGuess && incorrectGuessCross}
        {pokeSelection && formState===FormStateEnum.incorrectGuess && selectMove}
    </form>

}

export default Form;
