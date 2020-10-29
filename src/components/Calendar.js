import React, {useState} from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import ContainerView from './ContainerView';
import { TabContent, TabPane, Nav, NavItem, NavLink, Container } from "reactstrap"
import classnames from 'classnames';

export default function Calendar() {

  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  return (
    <Container>
      <Nav tabs className="mt-3">
        <NavItem style={{flex:1}} className="text-center">
          <NavLink
            className={classnames({ active: activeTab === '0' })}
            onClick={() => { toggle('0'); }}
            >
            Dag
          </NavLink>
        </NavItem>
        <NavItem style={{flex:1}} className="text-center">
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
            >
            Vecka
          </NavLink>
        </NavItem>
        <NavItem style={{flex:1}} className="text-center">
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
    </Container>
  )
}
        //<ContainerView />