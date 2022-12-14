import React, {useEffect, useState} from "react";
import getMoves from "../apiCalls";


function Form(){
    const [pokeSelection, setPokeSelection] = useState('');
    const [moves, setMoves] = useState([])
    const [children, setChildren] = useState([])
    const [moveDropdownOption, setMoveDropdownOption] = useState([])

    // let movesDropdownOptions = moves.map(x => {return {label: x, value: x}})
    // console.log('d',movesDropdownOptions)


    const selectMove = <div>
        <label>
            pick a move
            <select  onChange={handleChange}>
                {moveDropdownOption.map((options) => (
                    <option value={options.value}>{options.label}</option>
                ))}
            </select>
        </label>

    </div>

    useEffect( () => {
        setMoveDropdownOption(moves.map(x => {return {label: x, value: x}}))
        console.log('set moves', moves)
        setChildren(children.concat([selectMove]))

    }, [moves])

    useEffect(() => {
        setChildren(children.concat([selectPokemon]))
    }, [])

    function handleChange(event) {
       setPokeSelection(event.target.value)
    }

    async function handleSubmit(event) {
        const response = await getMoves(pokeSelection)
        setMoves(response);
        console.log('r',response)
        console.log('moves', moves)
        console.log('e',moveDropdownOption)

        // setChildren(children.concat([selectMove]))
        event.preventDefault();
    }

    const selectPokemon =<label>
        Pokemon:
        <input type="text" name="name" onChange={handleChange}/>
    </label>


    return <form action="#" onSubmit={handleSubmit}>
        {children}
        <button onClick={handleSubmit}> submit </button>
    </form>

}

export default Form;
