import Layout from "../components/Layout";
import { useState, useEffect} from "react";
import Link from 'next/link';
import Image from "next/image";

export default function Home({styles, pokemoni}) {
  console.log(pokemoni);
  const [searchresults, setSearchResults] = useState(pokemoni);
  const [pokeArr, setPokeArr] = useState(searchresults.slice(0, 20));
  const [pageno, setPageno] = useState(0);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  
  useEffect(() => {
    setPokeArr(searchresults.slice(pageno*20, (pageno*20)+20))
  }, [pageno])
  useEffect(()=>{
    setPokeArr(searchresults.slice(0, 20))
  }), [searchresults]
  useEffect(()=>{
    if(input.length===0 && filter ==="All"){
      setSearchResults(pokemoni)
      return
    }
    if(input.length!==0 && filter ==="All"){
      setSearchResults(c=>(c=pokemoni.filter((pokemoni)=>{
        return pokemoni.name.english.toLowerCase().includes(input.toLowerCase())
      })))
      return
    }
    if(input.length===0 && filter !=="All"){
      setSearchResults(c=>(c=pokemoni.filter((pokemoni)=>{
        return pokemoni.type.includes(filter)
      })))
      return
    }
    if(input.length!==0 && filter !=="All"){
      setSearchResults(c=>(c=pokemoni.filter((pokemoni)=>{
        return pokemoni.type.includes(filter) && pokemoni.name.english.toLowerCase().includes(input.toLowerCase())
      })))
      return
    }
  }, [input, filter])
  const handlePrev=()=>{
    setPageno(c=>{return c-1})
  }
  const handleNext=()=>{
    setPageno(c=>{return c+1})
  }
  const handleFilterChange=(e)=>{
    setFilter(e.target.value)
  }
  const handleInputChange=(e)=>{
    setInput(e.target.value)
  }

  return <Layout title={"WebPokedex"}>
    <div className="mx-70">
    <div className="flex justify-center pt-12  mx-auto sm:px-16 sm:w-1/1.2 py-4 ">
        <input type="text" placeholder="Search" className="mx-8 w-full sm:w-3/4 bg-gray-100 px-6 py-2 rounded border border-poke-yellow outline-none" onChange={handleInputChange} value={input} />
      </div>
      <div className="flex px-10  mx-auto sm:px-16 sm:w-1/2 py-4  items-center" >
        <label htmlFor="types" className="block mr-6 font-medium text-gray-900 text-lg sm:text-2xl">Type</label>
        <select name="types" id="types" defaultValue={"All"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 sm:p-2.5" onChange={handleFilterChange} value={filter}>
        <option value="All" >
              All
            </option>
            <option value="Normal">Normal</option>
            <option value="Fire">Fire</option>
            <option value="Water">Water</option>
            <option value="Electric">Electric</option>
            <option value="Grass">Grass</option>
            <option value="Ice">Ice</option>
            <option value="Fighting">Fighting</option>
            <option value="Poison">Poison</option>
            <option value="Ground">Ground</option>
            <option value="Flying">Flying</option>
            <option value="Psychic">Psychic</option>
            <option value="Bug">Bug</option>
            <option value="Rock">Rock</option>
            <option value="Ghost">Ghost</option>
            <option value="Dragon">Dragon</option>
            <option value="Dark">Dark</option>
            <option value="Steel">Steel</option>
            <option value="Fairy">Fairy</option>
        </select>
      </div>
      <div className="container mx-auto flex flex-wrap justify-center">
  {
    pokeArr.map((pokemon, i) => {
      return(
        
        <div key={pokemon.name.english} className="flex justify-center p-4 sm:w-1/3 lg:w-1/4  w-full" >
          <a href={`/pokemons/${pokemon.id}`}>
            
          <div className=" hover:shadow-xl hover:scale-105  py-4 px-6 rounded" style={{ backgroundColor: styles[pokemon.type[0].toUpperCase()] }}>
          
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`} className="h-[152px] w-[152px] sm:h-[200px] sm:w-[200px]"/>
            <div className="text-center">
                  {pokemon.type.map((type, j) => {
                    return (
                      <span
                        key={type}
                        className="text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                        style={{ backgroundColor: styles[type.toLowerCase()] }}
                      >
                        {type}
                      </span>
                    );
                  })}
                </div>
            <b><p className="text-center ">
              <span className="font-mono text-slate-600 text-3xl mr-2">
                {`${pokemon.id}.`}
              </span>
              <span className="font-mono text-3xl text-slate-600 ">{pokemon.name.english}</span>
            </p></b>

            
          </div></a>
        </div>
      )
    })
  }
</div>

<div className="container mx-auto flex flex-wrap justify-between pb-8 ">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
        onClick={handlePrev}
        disabled={pageno===0?true:false}>
          Previous
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-700"
        onClick={handleNext}
        disabled={searchresults.length/20-pageno<1?true:false}>
          Next
        </button>
      </div>
      </div>
  </Layout>
  
}

export async function getStaticProps() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json");
    const pokemoni = await response.json();
    
    return {
      props: {
        pokemoni,
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
          FAIRY: "rgba(214, 133, 173, 0.4)"
        },
      },
    };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}
