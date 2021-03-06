import React, { useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Button, Form, FormGroup, Input, Alert } from  "reactstrap";
import { Context, setTheme } from "../App";

export default function Login() {
  // eslint-disable-next-line
  const [state, setState] = useState({
    redirect: false,
  });

  let [,updateContext] = useContext(Context);
  let [redirect, setRedirect] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  let [showAlert, setShowAlert] = useState(false);

  async function login(e) {
    e.preventDefault();
    let result = await (
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
    ).json();

    if (result.error) {
      setFormData({ email: "", password: "" });
      setShowAlert(true);
      return;
    }
    let invitations = await (await fetch('/api/events/invitations/get')).json();
      if (invitations.error) { return; }
    updateContext({ user: result, invitations: invitations, theme: result.theme });
    setTheme(result.theme)
    setRedirect({ redirect: true });
  }

  if (redirect) {
    return <Redirect to="/myCalendar" />;
  }

  const handleInputChange = (e) =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  let { email, password } = formData;

  return (
    <Row className="justify-content-center mt-3">
      <Col xs="12" lg="6" className="text-center">
        <h1>Logga in</h1>
        <Alert color="danger" className="my-5"
            isOpen={showAlert}
            toggle={() => setShowAlert(false)}>
            Epost eller lösenord fel!
          </Alert>
        <Form
          className="d-inline-flex flex-column w-75 w-lg-100"
          onSubmit={login}
        >
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
            <Button type="submit" color="primary" className="my-3 w-50">
              Logga in
            </Button>
          </Col>
          <Col xs="12">
          <Link to="/profile/new" className="mt-3">
            Har du inte ett konto?
            <br />
            Registrera
          </Link>
          </Col>
        </Form>
      </Col>
    </Row>
  );
}
