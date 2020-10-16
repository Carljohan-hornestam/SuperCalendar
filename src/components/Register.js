import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import {Button, Input} from "reactstrap"

export default function Register () {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
      })

    async function register(e) {
        e.preventDefault()
        let result = await (await fetch("/api/users/", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(formData)
        })).json()
        //On successful registration, login and redirect to calendar view
        console.log("Register obj: ", result);
      }

      const handleInputChange = e => setFormData({
        ...formData, 
        [e.currentTarget.name]: e.currentTarget.value
      })

      let {username, email, password} = formData

    return (
        <div className="justify-content-center row">
            <div className="col-12 col-lg-6 text-center">
                <h1>Registrera</h1>
                <form className="d-inline-flex flex-column w-75 w-lg-100" onSubmit={register}>
                    <Input className="mt-3 p-1" type="text" value={username} name="username" placeholder="Användarnamn" onChange={handleInputChange} required></Input>
                    <Input className="mt-3 p-1" type="email" value={email} name="email" placeholder="Epost" onChange={handleInputChange} required></Input>
                    <Input className="mt-3 p-1" type="password" value={password} name="password" placeholder="Password" onChange={handleInputChange} required></Input>
                    <div className="text-center"><Button type="submit" color="primary" className="mt-3 w-50">Registrera</Button></div>
                    <Link to="/login" className="mt-3">Har du redan ett konto? Logga in här.</Link>
                </form>
            </div>
        </div>
    )
}