import React, {useState, createContext} from 'react';
import ListPersons from "./components/ListPersons"
import {BrowserRouter as Router, Route} from "react-router-dom" 
import EditPerson from './components/EditPerson';
import Register from './components/Register'
import Login from './components/Login'
import Header from "./components/Header"
import Footer from './components/Footer';
import Calendar from './components/Calendar'

export const Context = createContext()

export default function App() {

  const [contextVal, setContext] = useState({})
  const updateContext = updates => setContext({
    ...contextVal,
    ...updates
  })
  
  return (
    <Context.Provider value={[contextVal, updateContext]}>
      <Router>
        <Header />
        <div className="container">
          <Route path="/person/:id">
            <EditPerson />      
          </Route>
          <Route exact path="/">
            <ListPersons />
          </Route>
          <Route exact path="/mycalendar">
            <Calendar />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
        </div>
        <Footer/>
      </Router>
    </Context.Provider>
  );
}