import React, {useState} from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import ContainerView from './ContainerView';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Container } from "reactstrap"
import classnames from 'classnames';

export default function Calendar() {

    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return (
        <Container>
            <Nav tabs>
                <NavItem>
            <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
            >
            Week
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            Month
          </NavLink>
        </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId="1"><WeekView /></TabPane>
                <TabPane tabId="2"><MonthView /></TabPane>
            </TabContent>
            <ContainerView />
        </Container>)
}