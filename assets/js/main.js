const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchBar = document.getElementById("search-bar");

const maxRecord = 151;
const limit = 24;
let offset = 0;
let allPokemons = []; // Array para armazenar todos os Pokémon

const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;

  pokemon.types = types;
  pokemon.type = type;

  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

  return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
  return axios.get(pokemon.url).then((response) => {
    const pokeDetail = response.data;
    return convertPokeApiDetailToPokemon(pokeDetail);
  });
};

pokeApi.getAllPokemons = () => {
  const url = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${maxRecord}`;
  return axios.get(url).then((response) => {
    const jsonBody = response.data;
    const pokemons = jsonBody.results;
    const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
    return Promise.all(detailRequests);
  });
};

function loadPokemonItems() {
  pokeApi.getAllPokemons().then((pokemons = []) => {
    allPokemons = pokemons; // Armazena todos os Pokémon

    filterPokemons(searchInput.value.toLowerCase()); // Filtra os Pokémon com base na pesquisa

    if (allPokemons.length === 0) {
      const noResultsMessage = document.createElement("li");
      noResultsMessage.textContent = "Nenhum Pokémon encontrado.";
      pokemonList.appendChild(noResultsMessage);
    }
  });
}

function filterPokemons(searchText) {
  const filteredPokemons = allPokemons.filter((pokemon) => {
    const pokemonName = pokemon.name.toLowerCase();
    const pokemonNumber = pokemon.number.toString();
    const pokemonType = pokemon.type.toLowerCase();

    return (
      pokemonName.includes(searchText) ||
      pokemonNumber.includes(searchText) ||
      pokemonType.includes(searchText)
    );
  });

  const newHtml = filteredPokemons
    .map(
      (pokemon) => `
        <li class="pokemon ${pokemon.type}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
          <div class="detail">
            <ol class="types">
              ${pokemon.types
                .map((type) => `<li class="type ${type}">${type}</li>`)
                .join("")}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
          </div>
        </li>
      `
    )
    .join("");

  pokemonList.innerHTML = newHtml; // Atualiza a lista de Pokémon

  if (filteredPokemons.length === 0 && searchText !== "") {
    const noResultsMessage = document.createElement("li");
    noResultsMessage.textContent = "Nenhum Pokémon encontrado.";
    pokemonList.appendChild(noResultsMessage);
  }
}

function handleSearch(event) {
  const searchText = event.target.value.toLowerCase();
  filterPokemons(searchText);
}

loadPokemonItems();

searchInput.addEventListener("input", handleSearch);

class Pokemon {
  number;
  name;
  types = [];
  photo;
}
