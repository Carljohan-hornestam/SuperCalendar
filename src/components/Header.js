import React, { useState, useContext } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Logo from "../images/supercalender.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Context } from "../App";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  let [context, updateContext] = useContext(Context);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    updateContext({ user: false });
  };

  return (
    <div className="header">
      <Navbar color="dark" dark expand="md">
        <NavbarBrand>
          <img alt="" src={Logo} width="252px" height="35px" />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {context.user ? (
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  className="nav-link text-center"
                  to="/profile"
                >
                  <span className="d-block d-md-none">Profil</span>
                  <FontAwesomeIcon
                    className="d-none d-md-block"
                    size="2x"
                    icon={faUserEdit}
                  />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  className="nav-link text-center"
                  onClick={logout}
                  to="/login"
                >
                  <span className="d-block d-md-none">Logga ut</span>
                  <FontAwesomeIcon
                    className="d-none d-md-block"
                    size="2x"
                    icon={faSignOutAlt}
                  />
                </NavLink>
              </NavItem>
            </Nav>
          ) : (
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  className="nav-link text-center"
                  to="/register"
                >
                  <span className="d-block d-md-none">Registrera</span>
                  <FontAwesomeIcon
                    className="d-none d-md-block"
                    size="2x"
                    icon={faUserPlus}
                  />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RouterNavLink}
                  className="nav-link text-center"
                  to="/login"
                >
                  <span className="d-block d-md-none">Logga in</span>
                  <FontAwesomeIcon
                    className="d-none d-md-block"
                    size="2x"
                    icon={faSignInAlt}
                  />
                </NavLink>
              </NavItem>
            </Nav>
          )}
        </Collapse>
      </Navbar>
    </div>
  );
}
