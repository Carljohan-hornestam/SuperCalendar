import React from 'react';
import ListPersons from "./components/ListPersons"
import {BrowserRouter as Router, Route} from "react-router-dom" 
import EditPerson from './components/EditPerson';
import Register from './components/Register'
import Login from './components/Login'

export default function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/person/:id">
          <EditPerson />      
        </Route>
        <Route exact path="/">
          <ListPersons />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
      </div>
    </Router>
  );
}