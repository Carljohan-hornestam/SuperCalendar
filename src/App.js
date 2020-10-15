import React from 'react';
import ListPersons from "./ListPersons"
import {BrowserRouter as Router, Route} from "react-router-dom" 
import EditPerson from './EditPerson';

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
      </div>
    </Router>
  );
}