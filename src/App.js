import React from 'react';
import ListPersons from "./components/ListPersons"
import {BrowserRouter as Router, Route} from "react-router-dom" 
import EditPerson from './components/EditPerson';
import Register from './components/Register'
import Login from './components/Login'
import Header from "./components/Header"
import Footer from './components/Footer';
import Calendar from './components/CalendarMonthView';
import WeekView from './components/WeekView';

export default function App() {
  return (
    <Router>
      <Header />
      <Container>
        <Route path="/mycalendar">
          <WeekDays/>
        </Route>
        <Route path="/person/:id">
          <EditPerson />      
        </Route>
        <Route exact path="/">
          <ListPersons />
        </Route>
        <Route exact path="/mycalendar">
          <Calendar />
        </Route>
        <Route exact path="/myweek">
          <WeekView />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
      </Container>
      <Footer/>
    </Router>
  );
}