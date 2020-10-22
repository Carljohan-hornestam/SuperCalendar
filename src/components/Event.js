import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Alert,
  Label,
} from "reactstrap";
import { Context } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DateTimePicker from "./DateTimePicker";

export default function Event() {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    startDateTime: "",
    endDateTime: "",
    title: "",
    description: "",
    location: "",
    recurringEvent: false,
  });

  let [context] = useContext(Context);

  let {
    startDateTime,
    endDateTime,
    title,
    description,
    location,
    recurringEvent,
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
      });
      return;
    }
    // Since you should not make useEffect functions async, we need to create another function that is async
    // in order to use await with our fetch
    (async () =>
      setFormData(await (await fetch("/api/events/" + id)).json()))();
  }, [id]);

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

  console.log("id: ", id);
  return (
      <>
    <Row>
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
      <Form>
        <Row>
          <Col xs="12" md="6">
            <DateTimePicker header="Startdatum och -tid" />
            <DateTimePicker header="Slutdatum och -tid" />
          </Col>
        </Row>
      </Form>
      <FormGroup>
        <Label for="exampleText">Beskrivning</Label>
        <Input className="" type="textarea" name="text" id="exampleText" />
      </FormGroup>
      </>
  );
}
