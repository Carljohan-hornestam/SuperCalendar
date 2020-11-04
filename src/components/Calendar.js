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
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardText,
  CardSubtitle,
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
  Button,
} from "reactstrap";

export default function Calendar() {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [searchModal, setSearchModal] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [searchResult, setSearchResult] = useState([]);

  async function doSearch() {
    let result = await (await fetch("/api/events/search/" + searchText)).json();
    setSearchResult(result);
  }

  return (
    <>
      <div>
        <Modal isOpen={searchModal} toggle={() => setSearchModal(!searchModal)}>
          <ModalHeader toggle={() => setSearchModal(!searchModal)}>
            Sök kalenderhändelse
          </ModalHeader>
          <ModalBody>
            <InputGroup className="mb-2">
              <Input
                type="text"
                placeholder="Ange sökord"
                name="searchText"
                onChange={(e) => setSearchText(e.currentTarget.value)}
              ></Input>
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

            {searchResult.map((res) => (
              <Link to={"event/" + res.id} key={res.id}>
                <Card outline color="primary" className="mb-1">
                  <CardHeader>
                    <strong>{res.title}</strong> (<small>id: {res.id}</small>)
                  </CardHeader>
                  <CardBody>
                    <CardTitle>{res.description}</CardTitle>
                    <CardText>
                      {res.startDateTime} - {res.endDateTime}
                    </CardText>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </ModalBody>
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
