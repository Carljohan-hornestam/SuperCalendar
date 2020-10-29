import React, {useState, useEffect, createContext} from 'react';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom" 
import Register from './components/Register'
import Login from './components/Login'
import Header from "./components/Header"
import Footer from './components/Footer';
import Calendar from './components/Calendar'
import Event from './components/Event'

export const Context = createContext()

export default function App() {

  const [contextVal, setContext] = useState({})
  const updateContext = updates => setContext({
    ...contextVal,
    ...updates
  })

  useEffect(() => {
    updateContext({ waitingForUserState: true });
    (async () => {
      let result = await (await fetch('/api/auth/whoami')).json();
      updateContext({ waitingForUserState: false });
      if (result.error) { return; }
      // add the user data to the context variable
      updateContext({ user: result });
      return <Redirect to="/myCalendar" />
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <Context.Provider value={[contextVal, updateContext]}>
      <Router>
        <Header />
        <div className="container">
          <Route exact path="/mycalendar">
            <Calendar />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/event/:id">
            <Event />
          </Route>
        </div>
        <Footer/>
      </Router>
    </Context.Provider>
  );
}