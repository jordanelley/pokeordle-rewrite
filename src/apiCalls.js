import axios from "axios"

export async function getMoves(name) {
    const url = "https://pokeapi.co/api/v2/pokemon/" + name;
    const axiosResponse = await axios(url);
    return axiosResponse.data.moves.map(a => a.move.name)
}

export async function getPokemonByIndex(index) {
    const url = "https://pokeapi.co/api/v2/pokemon/" + index;
    const axiosResponse = await axios(url);
    return {
        name: axiosResponse.data.name,
        types: axiosResponse.data.types.map(a => a.type.name)
    }
}

export  async function getDamageInfoOnMove(move){
    const axiosResponseMove = await axios("https://pokeapi.co/api/v2/move/" + move);
    const typeURL = axiosResponseMove.data.type.url;
    const axiosResponseType = await axios(typeURL);
    return axiosResponseType.data.damage_relations;
}
