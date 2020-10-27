import React, { useState, useContext, useEffect } from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// import { Context } from "../App";
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

  const [availableParticipants, setAllUsers] = useState([])

  const [startTime, setStartTime] = useState({datum: "2020-11-27", tid: "09:00"});
  const [endTime, setEndTime] = useState({datum: "2020-11-29", tid: "10:00"});

  const [usersSelected, setUsersSelected] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    recurringEvent: 0,
    participants: []
  });

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers(){
    setAllUsers(await (await fetch('/api/users')).json())
  }

  let {
    title,
    description,
    location,
    recurringEvent,
    participants,
  } = formData;

  useEffect(() => {
    // If id is "new" then do nothing - we don't need to fetch data
    if (id === "new") {
      setFormData({
        ...formData,
        title: "",
        description: "",
        location: "",
        recurringEvent: 0,
        recurringInterval: 0,
        participants: [],
      });
      return;
    }
    // Since you should not make useEffect functions async, we need to create another function that is async
    // in order to use await with our fetch
    (async () =>
      setFormData(await (await fetch("/api/events/" + id)).json()))();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  }

  // När Event.js blir en modal, ersätt nedanstående if med att stänga modalen
  if (formData.done) {
    return <Redirect to="/myCalendar" />;
  }
  
  if (title === undefined) {
    return null;
  }
  
  function cancel() {
    setFormData({ done: true });
  }

  function modalSuccess() {
    let selectAvailable = document.querySelector('[name="selectAvailable"]');
    let opts = []
    for (var opt of selectAvailable.options) {
      if (opt.selected) {
        opts.push({label: opt.label, value: opt.value});
      }
    }

    participants.push(...opts)

    toggle();
  }

  async function save(e) {
    formData.endDateTime = endTime;
    formData.startDateTime = startTime;
    formData.participants = participants.map(user => ({ userId: user.value }))

    e.preventDefault()
    // Send the data to the REST api
    await fetch("/api/events/" + (id === "new" ? "" : id), {
      method: (id === "new" ? "POST" : "PUT"),
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })
 
    setFormData({done: true})
  }

  function filterAvailableParticipants() {
    return availableParticipants.filter(f => !participants.find(i => f.id == i.value))
  }

  function removeParticipantHandler() {
    let selectAvailable = document.querySelector('[name="selectParticipants"]');
    let opts = []
    for (var opt of selectAvailable.options) {
      if (opt.selected) {
        opts.push({label: opt.label, value: opt.value});
      }
    }

    participants.pop(opts)
    // participants = participants.filter(u1 => !opts.find(u2 => u1.id == u2.value))
    console.log(opts);
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
                  <option key={key} value={e.id}>
                    {e.email}
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
      
      <Form className="mb-5">
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
        <Row form>
          <Col xs="12" md="6">
            <FormGroup>
              <Label for="exampleText">Titel</Label>
              <Input
                className=""
                type="text"
                value={title}
                name="title"
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
              name="startDateTime"
              header="Startdatum och -tid"
              datetime={startTime}
              parentCallBack={setStartTime}
            />
            <DateTimePicker
              name="endDateTime"
              header="Slutdatum och -tid"
              datetime={endTime}
              parentCallBack={setEndTime}
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
                name="description"
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
                name="location"
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
                onClick={removeParticipantHandler}
              />
              {/* lägg in deltagare i value */}
              <Input
                type="select"
                name="selectParticipants"
                id="exampleSelectMulti"
                multiple
              >
                {participants.map((e, key) => {
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
                  onClick={cancel}
                />
              ) : (
                <FontAwesomeIcon
                  size="2x"
                  icon={faTimes}
                  className="float-left text-danger"
                  onClick={cancel}
                />
              )}
            </h5>
            <FontAwesomeIcon
              size="2x"
              icon={faCheck}
              className="float-right text-success"
              onClick={save}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}
