import React, { useState, useContext } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  CardText,
  CardSubtitle,
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
  faEnvelope,
  faEnvelopeOpenText,
  faTimes,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Context, setTheme } from "../App";
import { useMediaQuery } from 'react-responsive'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  let [context, updateContext] = useContext(Context);

  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    updateContext({ user: false, invitations: null, theme: "dark-theme" });
    setTheme("dark-theme")
  };

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 600px)"
  })

  async function handleInvitation(accept, invitationId, eventId) {
    console.log('handleInvitation, accept:', accept, ' id:', invitationId);

    const body = {
        "userId": context.user.id,
        "pendingInvitationId": invitationId,
        "accept": accept
      }

    let result = await (await fetch("/api/events/invitations/reply/" , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })).json();

    console.log('Result from reply:', result);

    let invitations = await (await fetch('/api/events/invitations/get')).json();
    if (invitations.error) { return; }
    updateContext({ invitations: invitations});      
  }

  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Dina inbjudningar</ModalHeader>
          <ModalBody>
            {context.invitations && context.invitations.map((element) => {
              return (
                <Card key={element.id} outline color="primary" className="mb-1">
                  <CardHeader><strong>{element.title}</strong> (<small>id: {element.id}</small>)</CardHeader>
                  <CardBody>
                    <CardTitle>Inbjuden av: {element.userName} (<small>{element.email}</small>)</CardTitle>
                    <CardSubtitle>{element.description}</CardSubtitle>
                    <CardText>{element.startDateTime} - {element.endDateTime}</CardText>
                  </CardBody>
                  <CardFooter>
                    <FontAwesomeIcon
                      className="float-left text-danger pointer"
                      size="2x"
                      icon={faTimes}
                      onClick={() => handleInvitation(false, element.id, element.eventId)}
                      />
                    <FontAwesomeIcon
                      className="float-right text-success pointer"
                      size="2x"
                      icon={faCheck}
                      onClick={() => handleInvitation(true, element.id, element.eventId)}
                      />
                  </CardFooter>
                </Card>
            )})}
            
          </ModalBody>
          <ModalFooter className="justify-content-center">
            <div>Klicka på&nbsp;<span className="text-danger"><strong>X</strong></span> för att radera och <span className="text-success"><strong>&#x2713;</strong></span>&nbsp;för att acceptera.</div>
          </ModalFooter>
        </Modal>
      </div>

      <div className="header">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>
            <RouterNavLink to="/myCalendar">
              <img alt="" src={Logo} width="252px" height="35px" />
            </RouterNavLink>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          { !isDesktop && context.invitations && context.invitations.length ? (
            <div className="float-right d-flex justify-content-center bg-danger notification"></div>
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
                    to={ "/profile/" + context.user.id } >
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
                    className="nav-link text-center"
                    onClick={toggleModal}
                    disabled={
                      !context.invitations ||
                      (context.invitations && !context.invitations.length)
                    }
                    href="#"
                  >
                    <span className="d-block d-md-none">Inbjudningar</span>
                    <FontAwesomeIcon
                      className={`d-none d-md-block hover ${!context.invitations ||
                        (context.invitations && !context.invitations.length) ? 'text-secondary' : 'text-danger'}` } 
                      size="2x"
                      icon={!context.invitations ||
                        (context.invitations && !context.invitations.length) ? faEnvelope : faEnvelopeOpenText}              
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
                    to="/profile/new"
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
