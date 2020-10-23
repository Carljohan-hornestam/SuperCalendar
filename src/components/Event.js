import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTimes,
  faCheck,
  faLongArrowAltLeft,
  faPlusCircle,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "./DateTimePicker";

export default function Event() {
  const { id } = useParams();

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    title: "",
    description: "",
    location: "",
    recurringEvent: false,
    addedParticipants: [
      { label: "Jaonis", value: 1 },
      { label: "Calleponken", value: 2 },
    ],
  });

  // const [participants] = useState([
  //   { name: "Jaonis", id: 1 },
  //   { name: "Calle", id: 2 },
  // ]);

  const [availableParticipants] = useState([
    { label: "Alexus", value: 3 },
    { label: "Jocke", value: 4 },
  ]);

  let [selectedParticipants, setSelectedParticipants] = useState([]);
  // console.log("participants: ", participants);

  let [context] = useContext(Context);

  let {
    startDateTime,
    endDateTime,
    title,
    description,
    location,
    recurringEvent,
    addedParticipants,
  } = formData;

  useEffect(() => {
    // If id is "new" then do nothing - we don't need to fetch data
    if (id === "new") {
      setFormData({
        ...formData,
        startDateTime: "",
        endDateTime: "",
        title: "",
        description: "",
        location: "",
        recurringEvent: false,
        addedParticipants: [],
      });
      return;
    }
    // Since you should not make useEffect functions async, we need to create another function that is async
    // in order to use await with our fetch
    (async () =>
      setFormData(await (await fetch("/api/events/" + id)).json()))();
  }, [id]);

  const handleInputChange = (e) =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  if (title === undefined) {
    return null;
  }

  // När Event.js blir en modal, ersätt nedanstående if med att stänga modalen

  if (formData.done) {
    return <Redirect to="/myCalendar" />;
  }

  async function save(e) {
    // the default behaviour of a form submit is to reload the page
    // stop that- we are not barbarians, we are SPA developer
    e.preventDefault();

    //  Send the data to the REST api
    if (id === "new") {
      formData.creatorId = context.user.id;
      formData.ownerId = context.user.id;
    }

    let result = await (
      await fetch("/api/events" + (id === "new" ? "" : id), {
        method: id === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    ).json();

    console.log("result i save = ", result);
    setFormData({ done: true });
  }

  function cancel() {
    setFormData({ done: true });
  }

  function addToParticipants() {}

  let usersToPost = [];

  function handleSelectEvent(e) {
    // let opts = [], opt;
    // for (let i = 0, len = event.target.options.length; i < len; i++) {
    //     opt = event.target.options[i];
    //     console.log("opt.label: ", opt.label, "opt.value: ", opt.value);
    //     if (opt.selected) {
    //         opts.push({label: opt.label, value: opt.value});
    //     }

    // }
    // setSelectedParticipants(
    //   Array.isArray(event) ? event.map((x) => x.value) : []
    // );
    let opts = Array.from(e.target.selectedOptions, (opt) => ({label: opt.label, value: opt.value}));

    setSelectedParticipants({ selectedParticipants: opts });
  }

  function modalSuccess() {
    let selectAvailable = document.querySelector('[name="selectAvailable"]');
    let opts = []
    for (var opt of selectAvailable.options) {
      if (opt.selected) {
        opts.push({label: opt.label, value: opt.value});
      }
    }

    addedParticipants.push(...opts)

    toggle();
  }

  function tempSave() {

  }

  function filterAvailableParticipants() {
    return availableParticipants.filter(f => !addedParticipants.find(i => f.value == i.value))
  }

  return (
    <>
      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Lägg till deltagare</ModalHeader>
          <ModalBody>
            <Input
              type="select"
              name="selectAvailable"
              id="exampleSelectMulti"
              multiple
            >
              {filterAvailableParticipants().map((e, key) => {
                return (
                  <option key={key} value={e.value}>
                    {e.label}
                  </option>
                );
              })}
            </Input>
          </ModalBody>
          <ModalFooter>
            <FontAwesomeIcon
              size="2x"
              icon={faTimes}
              className="float-left text-danger"
              onClick={toggle}
            />
            <FontAwesomeIcon
              size="2x"
              icon={faCheck}
              className="float-right text-success"
              onClick={modalSuccess}
            />
          </ModalFooter>
        </Modal>
      </div>
      <Row form>
        <Col>
          <h5 className="d-inline-block p-2">
            {id === "new" ? "Ny händelse" : "pilledutt"}
          </h5>

          {id !== "new" ? (
            <FontAwesomeIcon
              className=" float-right my-2"
              size="2x"
              icon={faTrash}
            />
          ) : (
            ""
          )}
        </Col>
      </Row>
      <Form className="mb-5">
        <Row form>
          <Col xs="12" md="6">
            <FormGroup>
              <Label for="exampleText">Titel</Label>
              <Input
                className=""
                type="text"
                value={title}
                name="text"
                id="exampleText"
                placeholder="Titel"
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col xs="12" md="6">
            <DateTimePicker
              value={startDateTime}
              header="Startdatum och -tid"
            />
            <DateTimePicker
              value={endDateTime}
              header="Slutdatum och -tid"
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <Row form>
          <Col xs="12" md="6">
            <FormGroup>
              <Label for="exampleText">Beskrivning</Label>
              <Input
                value={description}
                className=""
                type="textarea"
                name="text"
                id="exampleText"
                placeholder="Beskrivning"
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col xs="12" md="6">
            <FormGroup>
              <Label for="exampleText">Plats</Label>
              <Input
                className=""
                type="text"
                value={location}
                name="text"
                id="exampleText"
                placeholder="Plats"
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col xs="12" md="6">
            <FormGroup>
              <Label for="exampleText">Deltagare</Label>
              <FontAwesomeIcon
                size="lg"
                icon={faPlusCircle}
                className="float-right text-success"
                onClick={toggle}
              />
              <FontAwesomeIcon
                size="lg"
                icon={faMinusCircle}
                className="float-right text-danger mr-2"
              />
              {/* lägg in deltagare i value */}
              <Input
                type="select"
                name="selectMulti"
                id="exampleSelectMulti"
                multiple
              >
                {addedParticipants.map((e, key) => {
                  return (
                    <option key={key} value={e.value}>
                      {e.label}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col className="mb-3">
            <h5 className="d-inline-block">
              {id === "new" ? (
                <FontAwesomeIcon
                  size="2x"
                  icon={faLongArrowAltLeft}
                  className="float-left text-danger"
                />
              ) : (
                <FontAwesomeIcon
                  size="2x"
                  icon={faTimes}
                  className="float-left text-danger"
                />
              )}
            </h5>
            <FontAwesomeIcon
              size="2x"
              icon={faCheck}
              className="float-right text-success"
              onClick={tempSave}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}