import React from 'react';
import ListPersons from "./components/ListPersons"
import {BrowserRouter as Router, Route} from "react-router-dom" 
import EditPerson from './components/EditPerson';

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