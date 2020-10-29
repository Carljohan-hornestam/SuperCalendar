import React, { useState, useContext } from "react";
import { NavLink as RouterNavLink, Link } from "react-router-dom";
import {
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  console.log("context i Header", context);
  console.log("context.user i Header", context.user);
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    updateContext({ user: false, invitations: null });
  };

  console.log("context i HEADER", context);
  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Dina inbjudningar</ModalHeader>
          <ModalBody>
            {context.invitations && context.invitations.map((element) => {
              return (
              <>
            <Link to={"/event/" + element.eventId}>
              <Row>
              <Col xs="6" md="1">
                Namn på event
                </Col>
                <Col xs="6" md="1">
                  Skapad av
                </Col>
                <Col xs="6" md="1">
                {element.title}
                </Col>
                <Col xs="6" md="1">
                {element.userName}
                </Col>
                <Col xs="6" md="1">
                {element.startDateTime}
                </Col>
                <Col xs="6" md="1">
                {element.endDateTime}
                </Col>
              </Row>
              </Link>
               
              </>
            )})}
            
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>

      <div className="header">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>
            <img alt="" src={Logo} width="252px" height="35px" />
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          {context.invitations && context.invitations.length ? (
            <span className="text-danger">*</span>
          ) : (
            ""
          )}
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
                <NavItem>
                  <NavLink
                    className="nav-link text-center"
                    onClick={toggleModal}
                    disabled={
                      !context.invitations ||
                      (context.invitations && !context.invitations.length)
                    }
                    href="#"
                  >
                    <span>Inbjudningar</span>
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
    </>
  );
}
