import React, {useState} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {Button, Input} from "reactstrap"

export default function Login () {

    const [state, setState] = useState({
        redirect : false
    })

    const [formData, setFormData] = useState({
        email: "",
        password: ""
      })

    async function login(e) {
        e.preventDefault()
        let result = await (await fetch("/api/auth/login", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          //body: JSON.stringify(formData)
          body: JSON.stringify({id:2})
        })).json()
        //Check if login was successful

        console.log("Loginpage, login (result.success): ", result.success);
        if(result.success === true){
          setState({redirect: true})
        }
      }

      const handleInputChange = e => setFormData({
        ...formData, 
        [e.currentTarget.name]: e.currentTarget.value
      })

      let {email, password} = formData

    return (
        state.redirect === true? <Redirect push={true} to="/mycalendar" /> : (
        <div className="justify-content-center row mt-3">
            <div className="col-12 col-lg-6 text-center">
                <h1>Logga in</h1>
                <form className="d-inline-flex flex-column w-75 w-lg-100" onSubmit={login}>
                    <Input className="mt-3 p-1" type="email" value={email} name="email" placeholder="Epost" onChange={handleInputChange} required></Input>
                    <Input className="mt-3 p-1" type="password" value={password} name="password" placeholder="Password" onChange={handleInputChange} required></Input>
                    <div className="text-center"><Button type="submit" color="primary" className="mt-3 w-50">Logga in</Button></div>
                    <Link to="/register" className="mt-3">Har du inte ett konto?<br/>Registrera</Link>
                </form>
            </div>
        </div>
    )
    )
}