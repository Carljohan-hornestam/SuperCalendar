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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCheck,
  faLongArrowAltLeft,
  faPlusCircle,
  faMinusCircle,
  faTrashAlt,
  faRedo,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "./DateTimePicker";
import { Context } from "../App";

export default function Event() {
  const { id } = useParams();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [cascadeModal, setCascadeModal] = useState(false);
  const toggleCascadeModal = () => setCascadeModal(!cascadeModal);

  const [deleteModal, setDeleteModal] = useState(false);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const [doCascade, setDoCascade] = useState(false)

  const [context] = useContext(Context);

  const [availableParticipants, setAvailableParticipants] = useState([]);

  const [startTime, setStartTime] = useState({
    datum: context.selectedDay
      ? context.selectedDay
      : new Date().toLocaleDateString(),
    tid: "09:00",
  });
  const [endTime, setEndTime] = useState({
    datum: context.selectedDay
      ? context.selectedDay
      : new Date().toLocaleDateString(),
    tid: "10:00",
  });

  const [recIntervalEnd, setRecIntervalEnd] = useState({
    datum: context.selectedDay 
    ? context.selectedDay :
    new Date().toLocaleDateString(),
    tid: '10:00',
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    recurringEvent: 0,
    recurringInterval: 0,
    participants: [],
  });

  const [hasSelection, setHasSelection] = useState(false);

  const [recInterval, setRecInterval] = useState(
    'Aldrig'
  );

  const recurringIntervalOptions = [
    {key: 0, value: `Aldrig`},
    {key: 1, value: `Varje dag`},
    {key: 2, value: `Varje vecka`},
    {key: 3, value: `Varje månad`},
    {key: 4, value: `Varje år`},
  ];

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
        recurringEvent: 0,
        recurringInterval: 0,
        participants: [],
      });
      return;
    }
    // Since you should not make useEffect functions async, we need to create another function that is async
    // in order to use await with our fetch
    (async () => {
      let result = await (await fetch("/api/events/" + id)).json();
      let p1 =
        result.participants &&
        result.participants.map((user) => ({
          ...user,
          accepted: true,
        }));
      let p =
        result.invited &&
        [...result.invited, ...p1]
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

      if (result.recurringEvent === 1) {        
        setRecInterval(recurringIntervalOptions.find(i => i.key === result.recurringInterval).value);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // useEffect

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  }; // handleInputChange

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

  function saveWrapper(e) {
    if (recInterval !== 'Aldrig' && id !== 'new') {
      toggleCascadeModal()
    }
    else {
      save(e)
    }
  }

  async function save(e) {
    formData.endDateTime = convertDate(endTime);
    formData.startDateTime = convertDate(startTime);
    formData.intervalEnd = convertDate(recIntervalEnd);
    formData.recurringInterval = recurringIntervalOptions.find(i => i.value === recInterval).key;
    formData.recurringInterval > 0 ? formData.recurringEvent = 1 : formData.recurringEvent = 0
    
    // if(id !== 'new') {
    //   formData.cascadeChange = doCascade
    //   delete formData.id
    // }

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

  function convertDate(dateTime) {
    return `${dateTime.datum}, ${dateTime.tid}`;
  }

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
      setHasSelection(false);
    }
  } // removeParticipantHandler

  function userListHasSelectedUsers() {
    let selectAvailable = document.querySelector('[name="selectParticipants"]');
    setHasSelection(selectAvailable && selectAvailable.value);
  } // userListHasSelectedUsers

  function handleIntervalOptions(value) {
    let a = recurringIntervalOptions.find(i => {
      return i.value === value
    })
    setRecInterval(a.value)
  } // handleIntervalOptions

  async function handleDeleteEvent() {
    await fetch("/api/events/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    toggleDeleteModal();
    setFormData({ done: true });
  } // handleDeleteEvent

  const disabled = !(
    (context.user &&
      +context.user.id === +formData.creatorId &&
      context.user &&
      +context.user.id === +formData.ownerId) ||
    id === "new"
  );

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
        <Modal isOpen={cascadeModal} toggle={toggleCascadeModal}>
          <ModalHeader toggle={toggleCascadeModal}>Ändra återkommande händelse</ModalHeader>
          <ModalBody>
            <Label 
            className="mx-4"
            for="cbCascade">
            <Input
              type="checkbox"
              name="cbCascade"
              value={doCascade}
              onChange={() => setDoCascade(!doCascade)}
            >
            </Input>
            Ändra alla återkommande händelser
            </Label>
          </ModalBody>
          <ModalFooter>
            <FontAwesomeIcon
              size="2x"
              icon={faCheck}
              className="float-right text-success"
              onClick={save}
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
            <Button onClick={handleDeleteEvent} color="danger">
              Ok
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <Form className="mb-5">
        <Row form>
          <Col>
            <h5 className="d-inline-block p-2">
              {id === "new" ? "Ny händelse" : title}
            </h5>

            {id !== "new" &&
            context.user &&
            +context.user.id === +formData.ownerId ? (
              <FontAwesomeIcon
                className=" float-right my-2 pointer"
                size="lg"
                icon={faTrashAlt}
                onClick={toggleDeleteModal}
              />
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row form className="my-2">
          <Col xs="12">
            <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Titel</InputGroupText>
            </InputGroupAddon>
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
            </InputGroup>
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
            <InputGroup className="my-2">
            <InputGroupAddon addonType="prepend">
            <InputGroupText>
            <FontAwesomeIcon
                  className=""
                  size="xs"
                  icon={faRedo}
                />
            </InputGroupText>
            </InputGroupAddon>
              <Input
                type="select"
                disabled={id !== 'new'}
                value={recInterval}
                className="form-control"
                onChange={(e) => handleIntervalOptions(e.currentTarget.value)}
              >
                {recurringIntervalOptions.map(e => (
                  <option key={e.key} value={e.value}>
                    {e.value}
                  </option>
                ))}
              </Input>
            </InputGroup>
          </Col>
        </Row>
        <Row form className={recInterval === 'Aldrig' ? 'd-none' : 'd-block'}>
          <Col xs="12" md="6">
          <DateTimePicker
            name="recurringIntervalEnd"
            header="Datum för sista händelse"
            datetime={recIntervalEnd}
            parentCallBack={setRecIntervalEnd}
            disabled={disabled || id !== 'new'}
            noTime
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
            <InputGroup className="my-2">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
              <FontAwesomeIcon
                  className=""
                  size="xs"
                  icon={faMapMarkerAlt}
                />
              </InputGroupText>
            </InputGroupAddon>
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
            </InputGroup>
          </Col>
        </Row>
        <Row form>
          <Col xs="12">
            <FormGroup>
              <Label for="selectParticipants">Deltagare</Label>
              {(context.user && +context.user.id === +formData.creatorId) ||
              id === "new" ? (
                <>
                  <FontAwesomeIcon
                    size="lg"
                    icon={faPlusCircle}
                    className={`${
                      disabled ? "plusButtonDisable" : "plusButtonEnable"
                    } float-right pointer`}
                    onClick={disabled ? null : toggle}
                    //color={disabled ? "gray" : "green"}
                  />
                  <FontAwesomeIcon
                    size="lg"
                    icon={faMinusCircle}
                    className="float-right mr-2 pointer"
                    onClick={
                      disabled || !hasSelection
                        ? null
                        : removeParticipantHandler
                    }
                    color={disabled || !hasSelection ? "gray" : "red"}
                  />
                </>
              ) : (
                ""
              )}

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
                  className="float-left text-danger pointer"
                  onClick={cancel}
                />
              ) : (
                <FontAwesomeIcon
                  size="2x"
                  icon={faTimes}
                  className="float-left text-danger pointer"
                  onClick={cancel}
                />
              )}
            </h5>
            {!disabled ? (
              <FontAwesomeIcon
                size="2x"
                icon={faCheck}
                className="float-right text-success pointer"
                disabled={disabled}
                onClick={save}
              />
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Form>
    </>
  );
}
