import React, { useState, useEffect } from "react";
import Person from './components/Person'

export default function App() {
  const [allPersons, setAllPersons] = useState([]);

  async function fetchPersons() {
    setAllPersons(await (await fetch("api/persons")).json());
  }

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <div className="container">
      <div className="row">
      <div className="col">
      <h3 className="badge badge-primary">A list of all persons!</h3>
      </div>
      </div>
      <div className="row">
      {allPersons.map(person => (
        <Person key={person.id}{...person}/>
      ))}
      </div>
      </div>
  );
}
