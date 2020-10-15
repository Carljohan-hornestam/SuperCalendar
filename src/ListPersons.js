import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import Person from "./Person"

export default function ListPersons(){

  //  create allPersons as a state variable
  //  give it the value empty array...
  //  (note the destructuring assignment)
  const [allPersons, setAllPersons] = useState([])

  async function fetchPersons(){
    setAllPersons(await (await fetch("api/persons")).json())
  }

  //  useEffect a function to run when something has changed
  //  + an array of things (state variables) to watch for change
  //  (but if called with an empty array only ruins ONCE - when the component mounts)
  useEffect(() => {
    fetchPersons()
  }, [])
  
  async function deletePerson(id){
    let result = await( await fetch("/api/persons/" + id, {method: "DELETE"})).json()
    console.log("Result of deleting", result);
    await fetchPersons()
  }

  return (
    <> {/*The fragment tag/element let us encapsulate several in one virtual parent element without rendering to the DOM - but needed for a correct jsx expression */}
      <div className="row">
        <div className="col-12">
          <h3 className="text-primary my-4">List of all persons:
            <Link to="/person/new"
              className="btn btn-primary float-right"
              
              >Add new person</Link>
          </h3>
        </div>
      </div>
      <div className="row">
        {/* Loops in jsx are normally created using map on an array */
          allPersons.map( person => {
            // calculate age
            let today = new Date().toISOString().split('T')[0]
            let born = person.birthDate
            let age =  today.slice(0, 4) - born.slice(0, 4) - (born.slice(-5) > today.slice(-5))
            return {...person, age}   
          }).map(person => (
            <Person 
              key = {person.id} {...{...person, deletePerson}} 
            />
        ))}
      </div>
    </> 
  )


}