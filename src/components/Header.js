import React, {useState} from "react"
import {Link} from "react-router-dom"
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap'
import Logo from "../images/supercalender.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSignOutAlt, faSignInAlt, faUserPlus, faUserEdit} from "@fortawesome/free-solid-svg-icons"

export default function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [loggedIn, setLoggedIn] = useState(true)
  
  function logout(){
    setLoggedIn(false)
  }

  return (
    <div className="header">
      <Navbar color="dark" dark expand="md">
        <NavbarBrand><img alt="" src={Logo} width="252px" height="35px"/></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {loggedIn ? (
            <Nav className="ml-auto" navbar>
            <NavItem>
                <Link className="nav-link text-center" to="/profile">
                  <span className="d-block d-md-none">Profil</span>
                  <FontAwesomeIcon className="d-none d-md-block" size="2x" icon={faUserEdit}/>
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link text-center" onClick={logout} to="/login">
                  <span className="d-block d-md-none">Logga ut</span>
                  <FontAwesomeIcon className="d-none d-md-block" size="2x" icon={faSignOutAlt}/>
                </Link>
              </NavItem> 
            </Nav>) 
            : ( 
            <Nav className="ml-auto" navbar>
              <NavItem>
                  <Link className="nav-link text-center" to="/register">
                    <span className="d-block d-md-none">Registrera</span> 
                    <FontAwesomeIcon className="d-none d-md-block" size="2x" icon={faUserPlus}/>
                  </Link>
              </NavItem> 
              <NavItem>
                <Link className="nav-link text-center" to="/login">
                  <span className="d-block d-md-none">Logga in</span> 
                  <FontAwesomeIcon className="d-none d-md-block" size="2x" icon={faSignInAlt}/>
                </Link>
              </NavItem> 
            </Nav>
            )}
        </Collapse>
      </Navbar>
    </div>
  )
}