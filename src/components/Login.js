import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

export default function Login () {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
      })

    async function login(e) {
        e.preventDefault()
        let result = await (await fetch("/api/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(formData)
        })).json()
        //Fix a redirect on successful login to calendar view
      }

      const handleInputChange = e => setFormData({
        ...formData, 
        [e.currentTarget.name]: e.currentTarget.value
      })

      let {email, password} = formData

    return (
        <div className="justify-content-center row">
            <div className="col-12 col-lg-6 text-center">
                <h1>Logga in</h1>
                <form className="d-inline-flex flex-column w-75 w-lg-100" onSubmit={login}>
                    <input className="mt-3 p-1" type="email" value={email} name="email" placeholder="Epost" onChange={handleInputChange}></input>
                    <input className="mt-3 p-1" type="password" value={password} name="password" placeholder="Password" onChange={handleInputChange}></input>
                    <div className="text-center"><button type="submit" className="btn btn-primary mt-3 w-50">Logga in</button></div>
                    <Link to="/register" className="mt-3">Har du inte ett konto? Registrera här.</Link>
                </form>
            </div>
        </div>
    )
}