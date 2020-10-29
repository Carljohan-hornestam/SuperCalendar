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
  Button,
} from "reactstrap";

// import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faLongArrowAltLeft,
  faPlusCircle,
  faMinusCircle,
  faTrashAlt,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "./DateTimePicker";
import { Context } from "../App";

export default function Event() {
  const { id } = useParams();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const [context, updateContext] = useContext(Context);

  const [availableParticipants, setAvailableParticipants] = useState([]);

  const [startTime, setStartTime] = useState({
    datum: "2020-11-27",
    tid: "09:00",
  });
  const [endTime, setEndTime] = useState({ datum: "2020-11-29", tid: "10:00" });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    recurringEvent: 0,
    participants: [],
  });

  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setAvailableParticipants(await (await fetch("/api/users")).json());
  }

  let { title, description, location, recurringEvent, participants } = formData;

  useEffect(() => {
    // If id is "new" then do nothing - we don't need to fetch data
    if (id === "new") {
      setFormData({
        ...formData,
        title: "",
        description: "",
        location: "",
        recurringEvent: false,
        recurringInterval: 0,
        participants: [],
      });
      return;
    }
    // Since you should not make useEffect functions async, we need to create another function that is async
    // in order to use await with our fetch
    (async () => {
      let result = await (await fetch("/api/events/" + id)).json();
      let p1 = result.participants.map((user) => ({
        ...user,
        accepted: true,
      }));
      let p = [...result.invited, ...p1]
        .filter((user) => user)
        .map((user) => ({
          value: user.userId.toString(),
          label: user.email,
          accepted: user.accepted,
        }));
      result.id = result.eventId;
      delete result.eventId;
      delete result.userName;
      delete result.email;
      delete result.invited;

      setFormData({
        ...result,
        participants: p,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // useEffect

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  } // handleInputChange

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
    let opts = [];
    for (var opt of selectAvailable.options) {
      if (opt.selected) {
        opts.push({ label: opt.label, value: opt.value });
      }
    }

    participants.push(...opts);

    toggle();
  } // modalSuccess

  async function save(e) {
    formData.endDateTime = new Date(
      `${endTime.datum}, ${endTime.tid}`
    ).toLocaleString();
    formData.startDateTime = new Date(
      `${startTime.datum}, ${startTime.tid}`
    ).toLocaleString();
    formData.participants = participants.map((user) => ({
      userId: user.value,
    }));

    e.preventDefault();
    //Send the data to the REST api
    await fetch("/api/events/" + (id === "new" ? "" : id), {
      method: id === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ done: true });
  } // save

  function filterAvailableParticipants() {
    return availableParticipants.filter(
      (f) =>
        context.user &&
        +context.user.id !== +f.id &&
        !participants.find((i) => i && +f.id === +i.value)
    );
  } // filterAvailableParticipants

  function removeParticipantHandler() {
    let selectAvailable = document.querySelector('[name="selectParticipants"]');
    let opts = [];
    for (var opt of selectAvailable.options) {
      if (opt.selected) {
        opts.push({ label: opt.label, value: opt.value });
      }
    }

    let p = participants.filter(
      (u1) => !opts.find((u2) => +u1.value === +u2.value)
    );
    setFormData({
      ...formData,
      participants: p,
    });
    if (p.length === 0) {
      setHasSelection(false)
    }
  } // removeParticipantHandler

  function userListHasSelectedUsers() {
    let selectAvailable = document.querySelector('[name="selectParticipants"]');
    setHasSelection(selectAvailable && selectAvailable.value)
  } // userListHasSelectedUsers

  async function handleDeleteEvent() {
    await fetch("/api/events/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    toggleDeleteModal();
    setFormData({ done: true });
  } // handleDeleteEvent

  const disabled = !((context.user && +context.user.id === +formData.creatorId) || id === 'new')

 
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

      <div>
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>Ta bort event</ModalHeader>
          <ModalBody>Vill du verkligen radera eventet?</ModalBody>
          <ModalFooter>
            <Button onClick={toggleDeleteModal}>Avbryt</Button>
            <Button onClick={handleDeleteEvent} className="text-danger">Ok</Button>
          </ModalFooter>
        </Modal>
      </div>

      <Form className="mb-5">
        <Row form>
          <Col>
            <h5 className="d-inline-block p-2">
              {id === "new" ? "Ny händelse" : title}
            </h5>

            {id !== "new" && !disabled ? (
              <FontAwesomeIcon
                className=" float-right my-2"
                size="lg"
                icon={faTrashAlt}
                onClick={toggleDeleteModal}
              />
            ) : (<></>)}
          </Col>
        </Row>
        <Row form>
          <Col xs="12">
            <FormGroup>
              <Label for="exampleText">Titel</Label>
              {recurringEvent ? 
              <FontAwesomeIcon
                className=" float-right my-2"
                size="lg"
                icon={faRedo}
              />
              : "" }     
              <Input
                className=""
                type="text"
                value={title}
                name="title"
                id="exampleText"
                placeholder="Titel"
                disabled={disabled}
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
              disabled={disabled}
            />
            </Col>
          <Col xs="12" md="6">
            <DateTimePicker
              name="endDateTime"
              header="Slutdatum och -tid"
              datetime={endTime}
              parentCallBack={setEndTime}
              disabled={disabled}
            />
          </Col>
        </Row>
        <Row form>
          <Col xs="12">
            <FormGroup>
              <Label for="descriptionText">Beskrivning</Label>
              <Input
                value={description}
                className=""
                type="textarea"
                name="description"
                id="descriptionText"
                placeholder="Beskrivning"
                onChange={handleInputChange}
                disabled={disabled}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col xs="12">
            <FormGroup>
              <Label for="locationText">Plats</Label>
              <Input
                className=""
                type="text"
                value={location}
                name="location"
                id="locationText"
                placeholder="Plats"
                onChange={handleInputChange}
                disabled={disabled}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col xs="12">
            <FormGroup>
              <Label for="selectParticipants">Deltagare</Label>
              { (context.user && +context.user.id === +formData.creatorId) || id === 'new' ? 
              ( <>
                <FontAwesomeIcon
                  size="lg"
                  icon={faPlusCircle}
                  className="float-right"
                  onClick={disabled ? null : toggle}
                  color={disabled ? 'gray' : 'green'}
                />
                <FontAwesomeIcon
                  size="lg"
                  icon={faMinusCircle}
                  className="float-right mr-2"
                  onClick={disabled || !hasSelection ? null : removeParticipantHandler}
                  color={disabled || !hasSelection ? 'gray' : 'red'}
                />
              </>) : 
              (<div>Hoppsan Kerstin!</div>) }
               
              {/* lägg in deltagare i value */}
              <Input
                type="select"
                name="selectParticipants"
                id="selectParticipants"
                multiple
                disabled={disabled}
                onChange={userListHasSelectedUsers}
              >
                {participants.map((e, key) => {
                  return (
                    e && (
                      <option key={key} value={e.value}>
                        {e.accepted ? "+" : "-"} {e.label}
                      </option>
                    )
                  );
                })}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col className="mb-3">
            <h5 className="d-inline-block">
              {id === "new" || disabled ? (
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
            {!disabled ? 
            <FontAwesomeIcon
              size="2x"
              icon={faCheck}
              className="float-right text-success"
              disabled={disabled}
              onClick={save}
            />
           : "" } 
          </Col>
        </Row>
      </Form>
    </>
  );
}
