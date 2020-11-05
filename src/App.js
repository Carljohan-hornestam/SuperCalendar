import React, {useState, useEffect, createContext} from 'react';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom" 
import Profile from './components/Profile'
import Login from './components/Login'
import Header from "./components/Header"
import Footer from './components/Footer';
import Calendar from './components/Calendar'
import Event from './components/Event'
import moment from "moment" 

export const Context = createContext()

export function setTheme(value) {
    document.documentElement.className = ""
    document.documentElement.classList.add(`${value}`)
}

export default function App() {

  const [contextVal, setContext] = useState({
    selectedDay: moment().format("YYYY-MM-DD")
  })

  const updateContext = updates => setContext({
    ...contextVal,
    ...updates
  })

  useEffect(() => {
    updateContext({ waitingForUserState: true });
    (async () => {
      let result = await (await fetch('/api/auth/whoami')).json();
      if (result.error) {
        updateContext({ waitingForUserState: false });
        return;
      }
      // add the user data to the context variable
      // updateContext({ user: result });
      let invitations = await (await fetch('/api/events/invitations/get')).json();
      if (invitations.error) { return; }
      updateContext({ waitingForUserState: false, user: result, invitations: invitations});
      return <Redirect to="/myCalendar" />
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  if(contextVal.waitingForUserState){
    return null
  }
  setTheme(contextVal.user ? contextVal.user.theme : "dark-theme");

  return (
    <Context.Provider value={[contextVal, updateContext]}>
      <Router>
        <Header />
        <div className="container">
          <Route path="/">{!contextVal.user ? <Redirect push to="/login" /> : <Redirect push to="/myCalendar" />}
          </Route>
          <Route exact path="/mycalendar">
            <Calendar />
          </Route>
          <Route exact path="/profile/:id">
            <Profile />      
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