import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Button, Form, FormGroup, Input, Alert } from "reactstrap";
import { Context } from "../App";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [context, updateContext] = useContext(Context);

  const [showAlert, setShowAlert] = useState(false);

  let [redirect, setRedirect] = useState(false);

  async function register(e) {
    e.preventDefault();
    let result = await (
      await fetch("/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    ).json();

    if (result.error) {
      setShowAlert("Eposten finns redan!");
      let emailField = document.querySelector('[name="email"]');
      emailField.focus();
      return;
    }

    //On successful registration, login and redirect to calendar view
    result = await (
      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        headers: { "Content-Type": "application/json" },
      })
    ).json();
    updateContext({ user: result });

    // Done, so redirect
    setFormData({ done: true });
  }

  if (formData.error || formData.done) {
    return <Redirect to="/myCalendar" />;
  }

  let { username, email, password } = formData;

  if (email === undefined) {
    return null;
  }

  const handleInputChange = (e) =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  return (
    <Row className="justify-content-center row mt-3">
      <Col xs="12" lg="6" className="text-center">
        <h1>Registrera</h1>
        <Alert color="danger" className="my-5"
            isOpen={showAlert && showAlert !== ""}
            toggle={() => setShowAlert(false)}>
            {showAlert}
          </Alert>
        <Form
          className="d-inline-flex flex-column w-75 w-lg-100"
          onSubmit={register}
        >
          <FormGroup>
          <Input
            className="mt-3 p-1"
            type="text"
            value={username}
            name="username"
            placeholder="Användarnamn"
            onChange={handleInputChange}
            required
          ></Input>
          </FormGroup>
          <FormGroup>
          <Input
            className="mt-3 p-1"
            type="email"
            value={email}
            name="email"
            placeholder="Epost"
            onChange={handleInputChange}
            required
          ></Input>
          </FormGroup>
          <FormGroup>
          <Input
            className="mt-3 p-1"
            type="password"
            value={password}
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            required
          ></Input>
          </FormGroup>
          <Col xs="12" className="text-center">
            <Button type="submit" color="primary" className="mt-3 w-50">
              Registrera
            </Button>
          </Col>
          <Col xs="12">
          <Link to="/login" className="mt-3">
            Har du redan ett konto?
            <br />
            Logga in
          </Link>
          </Col>
        </Form>
      </Col>
    </Row>
  );
}
