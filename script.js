console.clear();
const card = document.body.querySelector(".card");
let isHidden = false;
window.onload = displayCard();
function displayCard() {
  if (!isHidden) {
    card.style.visibility = "hidden";
    isHidden = true;
    console.log("hidden");
  } else {
    card.style.visibility = "visible";
    console.log("visibile");
  }
}

const input = document.body.querySelector("input");
const tooltip = document.body.querySelector(".tooltip");

// input search bar //
input.addEventListener("keyup", (e) => {
  let searchTerm = input.value;

  if (searchTerm.length > 0 && e.code === "Enter") {
    getPokemon(searchTerm.toLowerCase());
    displayCard();
  }
});



let pokemon = {};
// FETCH MAIN POKEMON API USING SEARCH TERM FROM SEARCH INPUT BAR//
async function getPokemon(searchTerm) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchTerm}/`;
  
  const response = await fetch(apiUrl);
  handleErrors(response);
  const data = await response.json();

  tooltip.style.visibility = "hidden";

  console.log(data);

  pokemon = {
    name: data.name,
    hp: data.stats[0].base_stat,
    // typeIcon: await getTypeIcon(data.types[0].type.name),
    image: data.sprites.other["official-artwork"].front_default,
    moves: {
      firstMoveName: data.moves[10].move.name, //Almost all pokemons have the same moves from 0-10. 10+ is varied a little.
      firstMoveUrl: data.moves[10].move.url,
      firstMoveEffect: await getFirstMoveEffect(data.moves[10].move.url),
      secondMoveName: data.moves[11].move.name,
      secondMoveUrl: data.moves[11].move.url,
      secondMoveEffect: await getSecondMoveEffect(data.moves[11].move.url),
    },
    type: data.types[0].type.name,
    height: data.height,
    weight: data.weight,
    color: colorObj[data.types[0].type.name], //POKEMON COLOR IS BASED ON THE POKEMON TYPE.
  };

  injectIntoHtml(pokemon);
}
let isTooltip = false;
function handleErrors(response) {
  if (!response.ok) {
      tooltip.style.visibility="visible";
      isTooltip = true;
  }
  else{
    tooltip.style.visibility="hidden";
    isTooltip = false;
  }
  return response;
}

// FETCH POKEMON MOVES //

async function getFirstMoveEffect(firstMoveUrl) {
  const response = await fetch(firstMoveUrl);
  const data = await response.json();
  const firstMoveText = data.effect_entries[0].short_effect;
  console.log(firstMoveText);
  return firstMoveText;
}

async function getSecondMoveEffect(secondMoveUrl) {
  const response = await fetch(secondMoveUrl);
  const data = await response.json();
  const secondMoveText = data.effect_entries[0].short_effect;
  console.log(secondMoveText);
  return secondMoveText;
}

// FETCH POKEMON TYPE ICON //
// async function getTypeIcon(type){
//   console.log(type);
//   const response = await fetch(`/typeIcons/${type}.png`);
//   const blob = await response.blob();
//   return blob;

// }

// QUERY SELECTORS //
const img = document.body.querySelector(".pokemon-img");
const pokemonName = document.body.querySelector(".pokemon-name");
const hp = document.body.querySelector(".hp");
const typeIcon = document.body.querySelector(".typeIcon");
const firstMoveTitle = document.body.querySelector("#firstMoveTitle");
const secondMoveTitle = document.body.querySelector("#secondMoveTitle");
const type = document.body.querySelector(".type");
const height = document.body.querySelector(".height");
const weight = document.body.querySelector(".weight");

//INJECTING INTO HTML //
function injectIntoHtml(pokemon) {
  console.log(pokemon);
  (card.style.backgroundColor = pokemon.color),
    (pokemonName.innerHTML = pokemon.name);
  hp.innerHTML = pokemon.hp + " HP";
  img.setAttribute("src", pokemon.image);
  type.innerHTML = pokemon.type + " pokemon.";
  height.innerHTML = "Height: " + pokemon.height + ", ";
  weight.innerHTML = "Weight: " + pokemon.weight + ".";
  firstMoveTitle.innerHTML = pokemon.moves.firstMoveName;
  secondMoveTitle.innerHTML = pokemon.moves.secondMoveName;

  typeIcon.setAttribute("src", `/typeIcons/${pokemon.type}.png`);

  //creating and appending span elements to move titles just to get the desired style
  //of presenting the information. Could have been done easier is two <p> tags were
  //already created and are siblings to each other. 1 <p> for title and other for effect info
  const firstMoveInfo = document.createElement("span");
  firstMoveInfo.innerHTML = " " + pokemon.moves.firstMoveEffect;
  firstMoveTitle.appendChild(firstMoveInfo);

  const secondMoveInfo = document.createElement("span");
  secondMoveInfo.innerHTML = " " + pokemon.moves.firstMoveEffect;
  secondMoveTitle.appendChild(secondMoveInfo);
}

const colorObj = {
  bug: "#84C400",
  dark: "#5B5366",
  dragon: "#006FCA",
  electric: "#FBD200",
  fairy: "#FB8AEC",
  fighting: "#E12C6A",
  fire: "#FF983F",
  flying: "#8AACE4",
  ghost: "#4B6AB3",
  grass: "#35C04A",
  ground: "#E97333",
  ice: "#4BD2C1",
  normal: "#929BA3",
  poison: "#B667CF",
  psychic: "#FF6676",
  rock: "#C9B787",
  steel: "#5A8FA3",
  water: "#3393DD",
};
