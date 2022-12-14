import axios from "axios"

export default async function getMoves(name) {
    const axiosResponse = await axios("https://pokeapi.co/api/v2/pokemon/" + name);
    return axiosResponse.data.moves.map(a => a.move.name)
}

export async function getMovesFetch (name) {
    return fetch("https://pokeapi.co/api/v2/pokemon/pikachu").then( res => res.json());
}
