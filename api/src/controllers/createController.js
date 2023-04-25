const { Pokemon, Type } = require("../db.js");

const createPokemon = async (pokemon) => {
  const { name, hp, attack, defense, speed, height, weight, image, types } = pokemon;

  const pokemonName = name.trim().toLowerCase();

  // Search pokemon in DB
  let dbPokemon = await Pokemon.findOne({
    where: {
      name: pokemonName,
    },
  });

  if (dbPokemon) {
    throw new Error("Pokemon already exists");
  }

  const pokemonTypes = types.map((element) => element.trim().toLowerCase());

  // Search types in DB
  const existingTypes = await Type.findAll({
    where: {
      name: pokemonTypes,
    },
  });

  if (existingTypes.length !== pokemonTypes.length) {
    throw new Error("Invalid type");
  }

  // Create pokemon in DB
  const newPokemon = await Pokemon.create({
    name: pokemonName,
    hp,
    attack,
    defense,
    speed,
    height,
    weight,
    image,
  });

  // Add types to new pokemon
  await newPokemon.addTypes(existingTypes);

  const createdPokemon = await Pokemon.findOne({
    where: {
      id: newPokemon.id,
    },
    include: {
      model: Type,
    },
  });

  return {
    id: createdPokemon.id,
    name: createdPokemon.name,
    hp: createdPokemon.hp,
    attack: createdPokemon.attack,
    defense: createdPokemon.defense,
    speed: createdPokemon.speed,
    height: createdPokemon.height,
    weight: createdPokemon.weight,
    image: createdPokemon.image,
    types: createdPokemon.types.map((element) => element.name),
  };
};

module.exports = createPokemon;
