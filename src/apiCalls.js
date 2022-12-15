import axios from "axios"

export  async function getMoves(name) {
    const axiosResponse = await axios("https://pokeapi.co/api/v2/pokemon/" + name);
    return axiosResponse.data.moves.map(a => a.move.name)
}

export  async function getDamageInfoOnMove(move){
    const axiosResponseMove = await axios("https://pokeapi.co/api/v2/move/" + move);
    const typeURL = axiosResponseMove.data.type.url;
    const axiosResponseType = await axios(typeURL);
    return axiosResponseType.data.damage_relations;
    // console.log('type data' + axiosResponseType.data.damage_relations.double_damage_to[0].name);
}
