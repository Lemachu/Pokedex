import React from "react";
import Layout from "../../components/Layout";
import { useState, useEffect} from "react";
import axios from "axios";
import { getStaticProps } from "..";
import Link from 'next/link';


const Details = ({pokeman, styles, evolutionChain, species }) => {
  console.log(pokeman);
  const { name, stats, types, sprites, abilities } = pokeman;

  const [weaknesses, setWeaknesses] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [noDmg, setNoDmg] = useState([]);
  const [half, setHalf] = useState([]);
  
  useEffect(() => {
    if (pokeman.types && pokeman.types.length > 0) {
      const typeUrls = pokeman.types.map((type) => type.type.url);
      Promise.all(typeUrls.map((url) => fetch(url)))
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((types) => {
          const weaknesses = types
            .map((type) => type.damage_relations.double_damage_from)
            .flat()
            .map((type) => type.name);
          const strengths = types
            .map((type) => type.damage_relations.double_damage_to)
            .flat()
            .map((type) => type.name);
          const noDmg = types
            .map((type) => type.damage_relations.no_damage_from)
            .flat()
            .map((type) => type.name);
          const half = types
            .map((type) => type.damage_relations.half_damage_from)
            .flat()
            .map((type) => type.name);
          setHalf(half);
          setNoDmg(noDmg);
          setWeaknesses(weaknesses);
          setStrengths(strengths);
        });
    }
  }, [pokeman.types]);
  const filteredWeaknesses = weaknesses.filter((weakness) => {
    return !pokeman.types.some((type) => type.type.name === weakness) && !half.includes(weakness) && !noDmg.includes(weakness) && !strengths.includes(weakness);
  });
  
  const uniqueWeaknesses = Array.from(new Set(filteredWeaknesses));
  
  
  const typeList = types.map((type) => (
    <span
      key={type.type.name}
      className="text-white text-2xl font-semibold mr-2 px-4 rounded"
      style={{ backgroundColor: styles[type.type.name.toLowerCase()] }}
    >
      {type.type.name}
    </span>
  ));

  const statList = stats.map((stat) => (
    <li key={stat.stat.name}>
      <span className="font-semibold">{stat.stat.name}: </span>
      {stat.base_stat}
      <div className="relative w-full h-4 bg-gray-200 rounded-full mt-1">
        <div className="absolute top-0 left-0 h-full rounded-full" 
             style={{ width: `${stat.base_stat/255*100}%`,
                      backgroundColor: styles[stat.stat.name.toLowerCase()] }}></div>
      </div>
    </li>
  ));

  const abilitiji = pokeman.abilities.map((ability) => (
    <li key={ability.ability.name}>
      <span className="font-semibold ">{ability.ability.name}: </span>
      {ability.is_hidden ? "Hidden" : "Not hidden"}
    </li>
  ));


  const [evolutionList, setEvolutionList] = useState([]);

  useEffect(() => {
    const chain = [];
    const evolveData = (evolutionChainData) => {
      let chainData = evolutionChainData.chain;
      if (!chainData || !chainData.species) return; // Make sure data is present and in the expected format
      do {
        const currentPokemon = chainData.species.name;
        if (!chain.includes(currentPokemon)) {
          chain.push(currentPokemon);
        }
        chainData.evolves_to.forEach((evolution) => {
          const evolvedPokemon = evolution.species.name;
          if (!chain.includes(evolvedPokemon)) {
            chain.push(evolvedPokemon);
          }
          evolveData(evolution);
        });
        chainData = chainData.evolves_to[0];
      } while (chainData && chainData.evolves_to.length > 0);
      if (chainData && chainData.species) {
        const lastPokemon = chainData.species.name;
        if (!chain.includes(lastPokemon)) {
          chain.push(lastPokemon);
        }
      }
    };
    evolveData(evolutionChain);
  
    const fetchPokemonData = async () => {
      const data = await Promise.all(chain.map(async (pokemonName) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonData = await response.json();
        return {
          id: pokemonData.id,
          photo: pokemonData.sprites.front_default,
          types: pokemonData.types[0].type.name,
          name: pokemonData.name,
        };
      }));
      setEvolutionList(data);
    };
    fetchPokemonData();
  }, [evolutionChain]);
  const firstPokemon = evolutionList[0];
return (
    <Layout title={name}>
      <div className="bg-gray-50  rounded-lg shadow-md p-8 md:flex md:items-center px-5 sm:px-40" >
        <div className="md:w-1/3 rounded-full"style={{ backgroundColor: styles[types[0].type.name.toUpperCase()] }}>
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeman.id}.png`} alt={name} className="mb-4 w-full" />
        </div>
        <div className="md:w-2/3 md:pl-8">
        <div className="flex items-center">
          <p className="text-4xl font-semibold font-mono mb-4">{name.toUpperCase()}</p>
          <p className="text-4xl text-gray-400 font-mono font-semibold mb-4">#{String(pokeman.id).padStart(4, '0')}</p>
        </div>
        <p className="text-2xl text-gray-800 font-mono mb-4">{species.flavor_text_entries[0].flavor_text}</p>
        <h2 className="text-gray-950 text-2xl mb-4 font-semibold">Type:</h2>
          <div className="flex mb-4">{typeList}</div>
          <div>
        <h2 className="text-gray-950 text-2xl font-semibold mb-4">Weaknesses:</h2>
        {uniqueWeaknesses.map((weakness) => (
          <span key={weakness} className="text-white text-2xl font-semibold mr-2 px-4 rounded" style={{ backgroundColor: styles[weakness.toLowerCase()] }}>{weakness}</span>
        ))}
      </div>
           
      </div>
      </div>
      <div className="bg-white rounded-lg shadow-md pb-8 pt-5 mt-8 flex-col mx-auto sm:grid-cols-2 sm:grid">
  <div className="bg-gray-300 p-5 rounded-lg shadow-md m-5 sm:mx-40  mx-10 grid grid-cols-2 gap-4 pr-4">
    <div>
      <h2 className="text-gray-950 text-xl font-semibold mt-6">Height:</h2>
      <ul className="">{pokeman.height * 10} cm</ul>
      <h2 className="text-gray-950 text-xl font-semibold mt-6">Weight:</h2>
      <ul className="">{pokeman.weight / 10} kg</ul>
    </div>
    <div>
      <h2 className="text-gray-950 text-xl font-semibold mt-6">Abilities:</h2>
      <ul className="">{abilitiji}</ul>
      <h2 className="text-gray-950 text-xl font-semibold mt-6">Gender:</h2>
      <div className="relative w-full h-4 bg-gray-200 rounded-full mt-1" style={{backgroundColor: styles["water"] }}>
      <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${species.gender_rate*10}%`, backgroundColor: styles["fairy"] }}></div>
      </div>
      
    </div>
  </div>
  <div className="mx-5">
    <h2 className="text-gray-950 text-xl font-semibold mt-6">Stats:</h2>
    <ul className="mt-8 grid grid-cols-2 gap-4 pr-4">{statList}</ul>
  </div>
</div>

        
          
              
      
      <div className="flex flex-col items-center justify-center py-20 mt-10 bg-white rounded-lg shadow-md">
  <h1 className="mb-10 text-3xl font-semibold mb-4">Evolution Chain:</h1> 
      <ul className="flex items-center">
      {evolutionList.length > 3 ? (
        
           <div className="flex flex-col items-center">
           <div className="flex items-center">
             <div className="relative"><Link href={`/pokemons/${firstPokemon.id}`}>
               <img src={firstPokemon.photo} alt={firstPokemon.name} className="w-40 h-40 sm:w-64 sm:h-64 rounded-full" />
               <div className="absolute bottom-0 left-0 right-0 text-center font-bold text-gray-800">{firstPokemon.name}</div></Link>
             </div>
             <img src="/right-arrow.png" alt="arrow" className=" w-5 h-5" />
             <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
               {evolutionList.map((pokemon, index) => {
                 if (pokemon.id === firstPokemon.id) {
                   return null;
                 }
                 return (
                   <div key={index} className="flex items-center">
                     <div className="relative">
                     <Link href={`/pokemons/${pokemon.id}`}>
                       <img src={pokemon.photo} alt={pokemon.name} className="w-40 h-40 rounded-full" />
                       <div className="absolute bottom-0 left-0 right-0 text-center font-bold text-gray-800">{pokemon.name}</div>
                       </Link>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
           
         </div>
         
        ) : (
          <div className="flex grid-cols-2 items-center">
          {evolutionList.map((pokemon, index) => {
            const arrow = index === evolutionList.length - 1 ? null : <img src="/right-arrow.png" alt="arrow" className="mx-2 w-6 h-6" />
            return (
              <li key={index} className="flex grid-cols-2 items-center">
                 
               <Link href={`/pokemons/${pokemon.id}`}><div className="mr-2 center rounded-full"style={{ backgroundColor: styles[pokemon.types.toUpperCase()] }}>
                  <img src={pokemon.photo} alt={pokemon.name} className="w-35 h-35 sm:w-60 sm:h-60 rounded-full " />
                  
                </div> 
                <div className="text-center">
                  <div className="text-md text-gray-800 font-bold">{pokemon.name}</div>
                
                </div></Link>
                    <div className="mx-2 text-2xl text-gray-500">{arrow}</div>   
              </li>
            );
          })}
        </div>
        )}

  </ul>
      </div>

      
    </Layout>
  );
};


export async function getServerSideProps({ query }) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.id}`);
    const data = await response.json();
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${query.id}`);
    const speciesData = await speciesResponse.json();

    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionChainData = await evolutionChainResponse.json();
    console.log(speciesData);
    console.log(evolutionChainData);
    return {
      props: {
        pokeman: data,
        species: speciesData,
        evolutionChain: evolutionChainData,
        styles: {
          normal: "#A8A77A",
          fire: "#EE8130",
          water: "#6390F0",
          electric: "#F7D02C",
          grass: "#7AC74C",
          ice: "#96D9D6",
          fighting: "#C22E28",
          poison: "#A33EA1",
          ground: "#E2BF65",
          flying: "#A98FF3",
          psychic: "#F95587",
          bug: "#A6B91A",
          rock: "#B6A136",
          ghost: "#735797",
          dragon: "#6F35FC",
          dark: "#705746",
          steel: "#B7B7CE",
          fairy: "#D685AD",

          NORMAL: "rgba(168, 167, 122, 0.4)",
          FIRE: "rgba(238, 129, 48, 0.4)",
          WATER: "rgba(99, 144, 240, 0.4)",
          ELECTRIC: "rgba(247, 208, 44, 0.4)",
          GRASS: "rgba(122, 199, 76, 0.4)",
          ICE: "rgba(150, 217, 214, 0.4)",
          FIGHTING: "rgba(194, 46, 40, 0.4)",
          POISON: "rgba(163, 62, 161, 0.4)",
          GROUND: "rgba(226, 191, 101, 0.4)",
          FLYING: "rgba(169, 143, 243, 0.4)",
          PSYCHIC: "rgba(249, 85, 135, 0.4)",
          BUG: "rgba(166, 185, 26, 0.4)",
          ROCK: "rgba(182, 161, 54, 0.4)",
          GHOST: "rgba(115, 87, 151, 0.4)",
          DRAGON: "rgba(111, 53, 252, 0.4)",
          DARK: "rgba(112, 87, 70, 0.4)",
          STEEL: "rgba(183, 183, 206, 0.4)",
          FAIRY: "rgba(214, 133, 173, 0.4)",

          hp: "#EF5350",
          attack: "#2A75BB",
          defense: "#FECA1B",
          'special-attack': "#A33EA1",
          'special-defense': "#F95587",
          speed: "#6F35FC",
        },
      },
    };
  } catch (error) {
    console.log(error);
  }
}


export default Details;