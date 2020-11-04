import React, { useState } from "react";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-regular-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";

export default function Calendar() {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [searchModal, setSearchModal] = useState(false);

  const [searchText, setSearchText] = useState('')

  const [searchResult, setSearchResult] = useState([])

  async function doSearch() {
    let result = await(await fetch(''))


  }

  return (
    <>
      <div>
        <Modal isOpen={searchModal} toggle={() => setSearchModal(!searchModal)}>
          <ModalHeader
            toggle={() => setSearchModal(!searchModal)}
          >Sök kalenderhändelse</ModalHeader>
          <ModalBody>
            <InputGroup>
              <Input type="text" placeholder="Ange sökord" name="searchText" onChange={(e) => setSearchText(e.currentTarget.value)}></Input>
              <InputGroupAddon addonType="append">
                <Button className="my-0" color="primary" onClick={doSearch}>
                  <FontAwesomeIcon
                    color="white"
                    size="1x"
                    className="my-auto"
                    icon={faSearch}
                  />
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <ul className="my-2">
              <li>{searchText}HEJ</li>
            </ul>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
      <Container>
        <Nav tabs className="mt-3">
          <NavItem style={{ flex: 1 }} className="text-center tabsTheme">
            <NavLink
              className={classnames({ active: activeTab === "0" })}
              onClick={() => {
                toggle("0");
              }}
            >
              Dag
            </NavLink>
          </NavItem>
          <NavItem style={{ flex: 1 }} className="text-center tabsTheme">
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
            >
              Vecka
            </NavLink>
          </NavItem>
          <NavItem
            style={{ flex: 1 }}
            className="text-center d-none d-md-block tabsTheme"
          >
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
            >
              Månad
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="0">
            <DayView />
          </TabPane>
          <TabPane tabId="1">
            <WeekView />
          </TabPane>
          <TabPane tabId="2">
            <MonthView />
          </TabPane>
        </TabContent>
        <Link to="/event/new">
          <div className="float-right d-flex justify-content-center bg-danger fab fab-right">
            <FontAwesomeIcon
              color="white"
              size="2x"
              className="my-auto"
              icon={faCalendarPlus}
            />
          </div>
        </Link>
        <div
          className="float-left d-flex justify-content-center bg-secondary fab fab-left"
          onClick={() => setSearchModal(!searchModal)}
        >
          <FontAwesomeIcon
            color="white"
            size="2x"
            className="my-auto"
            icon={faSearch}
          />
        </div>
      </Container>
    </>
  );
}
