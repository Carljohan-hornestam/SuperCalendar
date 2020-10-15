import React from "react"
import {Link} from "react-router-dom" 

export default function Person(props){
    /* destructuring assignment of props to get individual variables */
    let {id, firstName, lastName, birthDate, age, deletePerson} = props
    return (
        <div className="col-12 col-lg-6">
            <div className="card mt-3">
                <div className="card-body">
                <h5 className="card-title">{firstName} {lastName}</h5>
                <p className="card-text">
                    was born {birthDate}
                    {age >= 18 ? ", " : " and " /*if/else -> use ternary operator*/}
                    is {age} years old 
                    {age >= 18 && " and of legal age" /*if -> use && operator*/}!
                </p>
                <button 
                    className="btn btn-danger float-right"
                    onClick={() => deletePerson(id)}
                    >Delete</button>
                <Link 
                    className="btn btn-primary float-right mr-2"
                    to={"/person/" + id}
                    >Edit</Link>
                </div>
            </div>
        </div>
    )
}