import { useState } from "react"
import "./App.css"


function App() {
  const [name, setName] = useState("");
  const[character, setCharacter] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getValues(){
   if(!name.trim()){
    setError("");
    setCharacter(null);
    return;
   }
  
   setCharacter(null);
  setLoading(true);

  try{
    const res = await fetch(`https://swapi.dev/api/people/?search=${name}`);
    const data = await res.json();

    

    if(data.results.length === 0){
      setError("No such guy, youngling");
      setLoading(false);
      return;
    }

      const character = data.results[0];
      const homeworldResponse = await fetch(character.homeworld);
      const homeworldData = await homeworldResponse.json();
      const encodedName = encodeURIComponent(character.name);
      let imageUrl = "https://via.placeholder.com/200";

      const imgRes = await fetch(`https://starwars-databank-server.vercel.app/api/v1/characters/name/${encodedName}`);

      if (imgRes.ok) {
    const imageData = await imgRes.json();
    if (imageData && imageData.length > 0) {
      imageUrl = imageData[0].image;
    }
  }

    setCharacter({
      name: character.name,
      height: character.height,
      homeworld: homeworldData.name,
      birthyear: character.birth_year,
      gender: character.gender,
      image: imageUrl,
      
    })
  }
  catch(error){
    setError("Error occured during retrival")
   console.log(error);
  }
  setLoading(false);
  }

  return (
    <>
      <h1 className="titl">Get to Know Star wars Characters</h1>

      <input type="text" id="input-text" value={name} onChange={(e)=> {setName(e.target.value); setError("");}} 
      onKeyDown={(e) => { if (e.key === "Enter") { getValues();}}} placeholder="Enter name"/>

      <button className="butt" onClick={getValues}>Search</button>

      {loading && <p className="loading">Loading...</p>}

      <div>
        {error && <p className="error">{error}</p>}

        {character && (
          <div className="character-card">
           <h2>{character.name}</h2>
           <img src={character.image} alt={character.name} />
           <p><b>Height: </b>{character.height}cm</p>
           <p><b>Gender: </b>{character.gender}</p>
           <p><b>Birth year: </b>{character.birthyear}</p>
           <p><b>Home World: </b>{character.homeworld}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default App
