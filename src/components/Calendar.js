import React, {useState} from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import ContainerView from './ContainerView';
import Event from './Event';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Modal, ModalBody } from "reactstrap"
import classnames from 'classnames';
import {faCalendarPlus} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Link, Redirect} from "react-router-dom" 
import { useMediaQuery } from 'react-responsive'

export default function Calendar() {

  const [activeTab, setActiveTab] = useState('1');
  const [modal, setModal] = useState(false);

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 600px)"
  })

  /* function openCreateEvent() {
    if(isDesktop) {
      setModal(!modal)
    } else {
      window.location.href = "/event/new"
    }
  } */

  return (
    <Container>
      <Nav tabs className="mt-3">
        <NavItem style={{flex:1}} className="text-center tabsTheme">
          <NavLink
            className={classnames({ active: activeTab === '0' })}
            onClick={() => { toggle('0'); }}
            >
            Dag
          </NavLink>
        </NavItem>
        <NavItem style={{flex:1}} className="text-center tabsTheme">
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
            >
            Vecka
          </NavLink>
        </NavItem>
        <NavItem style={{flex:1}} className="text-center d-none d-md-block tabsTheme">
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
            >
            Månad
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="0"><ContainerView/></TabPane>
        <TabPane tabId="1"><WeekView /></TabPane>
        <TabPane tabId="2"><MonthView /></TabPane>
      </TabContent>
      <Link to="/event/new"><div className="float-right d-flex justify-content-center bg-danger fab">
        <FontAwesomeIcon color="white" size="2x" className="my-auto" icon={faCalendarPlus} />
      </div>
      </Link>
      <div>
      <Modal toggle={() => setModal(!modal)} isOpen={modal}>
        <ModalBody>
          <Event />
        </ModalBody>
      </Modal>
    </div>
    </Container>
  )
}