import React, {useEffect, useState} from "react";
import {getMoves, getDamageInfoOnMove, getPokemonByIndex, getAllPokemon} from "../apiCalls";
import { FormStateEnum } from "../formstate.enum"
import { DamageStateEnum } from "../damageState.enum";
import cross from "../Images/cross.png"
import superEffective from "../Images/smileys/super-effective.png"
import regularEffective from "../Images/smileys/regular-effective.png"
import notEffective from "../Images/smileys/not-effective.png"

import '../App.css'

function Form(props){

    const [pokeSelection, setPokeSelection] = useState('');
    const [moveSelection, setMoveSelection] = useState('')

    const [moveDropdownOption, setMoveDropdownOption] = useState([])

    const [formState, setFormState] = useState(FormStateEnum.noGuesses)
    const [damageState, setDamageState] = useState(DamageStateEnum.none) //here
    const [typeCorrect, setTypeCorrect] = useState(false)

    const [dailyPokemon, setDailyPokemon] = useState({})
    const [allPokemon, setAllPokemon] = useState([])

    const damageStateMap = {
        [DamageStateEnum.none] : "",
        [DamageStateEnum.regular_damage]: "regular effectiveness",
        [DamageStateEnum.half_damage]: "not very effective",
        [DamageStateEnum.double_damage]: "super effective",
        [DamageStateEnum.no_damage]: "not damaging at all to"

    }
    async function turnDateIntoUniquePokemon(){
        const options = {day: 'numeric', month: 'numeric'};
        const date = new Date().toLocaleDateString(undefined, options);
        const number = parseInt(date.replaceAll("/",""));
        const index = Math.floor(number/20.65);
        console.log(date)
        console.log(number)
        return getPokemonByIndex(index);
    }

    useEffect(() => {
        const fetchData = async () => {
            const dailyPokemon = await turnDateIntoUniquePokemon();
            const allPokemon = await getAllPokemon();
            setDailyPokemon(dailyPokemon);
            console.log(dailyPokemon)
            setAllPokemon(['please select'].concat(allPokemon))
        }
        fetchData()
            .catch(console.error);
    }, [])

    const incorrectGuessCross = <img src={cross} id="cross"/>
    const superEffectiveSmiley = <img src={superEffective} id ="cross" />
    const notEffectiveSmiley = <img src={notEffective} id ="cross" />
    const regularEffectiveSmiley = <img src={regularEffective} id ="cross" />

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

    const damageStyle = (damageState) => {
        switch(damageState){
            case DamageStateEnum.double_damage:
                return {color: "#b0bf1a"}
            case DamageStateEnum.half_damage:
                return {color: "#f44336"}
            case DamageStateEnum.no_damage:
                return {color: "#f44336"}
            default:
                return {}
        }
    };

    const SmileyMap = {
        [DamageStateEnum.none] : "",
        [DamageStateEnum.regular_damage]: regularEffectiveSmiley,
        [DamageStateEnum.half_damage]: notEffectiveSmiley,
        [DamageStateEnum.double_damage]: superEffectiveSmiley,
        [DamageStateEnum.no_damage]: notEffectiveSmiley
    }

    const damageClue = <div>This move was <span style={damageStyle(damageState)}> {damageStateMap[damageState]} </span>against the target pokemon {SmileyMap[damageState]}</div>

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
            setDamageState(DamageStateEnum.regular_damage);
            return
        }
        if(damageRelations.includes("double_damage_to")){
            console.log('yup went here')
            setDamageState(DamageStateEnum.double_damage);
            console.log('r', DamageStateEnum.double_damage)
            return
        }
        if(damageRelations.includes("no_damage_to")){
            setDamageState(DamageStateEnum.no_damage);
            return
        }
        if(damageRelations.includes("half_damage_to")){
            setDamageState(DamageStateEnum.half_damage);
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

    const selectPokemon = (allPokemon) =>
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
        {formState===FormStateEnum.noGuesses? selectPokemon(allPokemon) : pokeSelection}
        {pokeSelection && formState===FormStateEnum.incorrectGuess && incorrectGuessCross}
        {!typeCorrect? pokeSelection && formState===FormStateEnum.incorrectGuess && damageState===DamageStateEnum.none? selectMove: moveSelection : ""}

        {typeCorrect && correctTypeClue()}
        {typeCorrect && letterClue}
        {damageState!==DamageStateEnum.none && moveSelection && damageClue}
    </div>

}

export default Form;
