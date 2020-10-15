import React, {useState, useEffect} from "react"
import {useParams, Redirect} from "react-router-dom"

export default function EditPerson(){
  const {id} = useParams()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: ""
  })

  useEffect(() => {
    // If id is "new" then do nothing - we don't need to fetch data

    if(id === "new" ) { 
      setFormData({...formData, firstName: "", lastName: "", birthDate: ""})
      return }
    // Since you should not make useEffect functions async, we need to create another function that is async
    // in order to use await with our fetch
    (async () => 
      setFormData(await (await fetch("/api/persons/" + id)).json()))()
  }, [id])
  
  // If formData contains an error (from REST api) then return to the first page

  if(formData.error || formData.done){
    return <Redirect to="/" />
  }

  const handleInputChange = e => setFormData({
    ...formData, 
    [e.currentTarget.name]: e.currentTarget.value
  })

  let {firstName, lastName, birthDate} = formData

  // Do not render anything until we have rendered the data
  if(firstName === undefined) { return null }

  function cancel(){
    setFormData({done: true})
  }

  async function save(e) {
    // the default behaviour of a form submit is to reload the page
    // stop that- we are not barbarians, we are SPA developer
    e.preventDefault()
    //  Send the data to the REST api
    let result = await (await fetch("/api/persons/" + (id === "new" ? "" : id), {
      method: (id === "new" ? "POST" : "PUT"),
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })).json()
    setFormData({done: true})
  }

  return (
    <>
    <div className="row">
      <div className="col-12">
        <h2>{id === "new" ? "Add new person" : "Editing " + firstName + " " + lastName}</h2>
      </div>
    </div>
    <div className="row">
      <div className="col-12">
        <form onSubmit={save}>
          <div className="form-group">
            <label className="w-100">First name
              <input name="firstName" type="text" value={firstName} className="form-control" placeholder="First name" onChange={handleInputChange} />
            </label>
          </div>
          <div className="form-group">
            <label className="w-100">Last name
              <input name="lastName" type="text" value={lastName} className="form-control" placeholder="Last name" onChange={handleInputChange} />
            </label>
          </div>
          <div className="form-group">
            <label className="w-100">Birthdate
              <input name="birthDate" type="text" value={birthDate} className="form-control" placeholder="Birthdate" onChange={handleInputChange} />
            </label>
          </div>
          <div className="float-right">
            <button className="btn btn-danger" onClick={cancel}>Cancel</button>      
            <input type="submit" className="btn btn-primary ml-3" value="Save"/>
          </div>  
        </form>
      </div>
    </div>
    </>
  )
}