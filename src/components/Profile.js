import React, { useState, useContext, useEffect } from "react";
import { Link, Redirect, useParams } from "react-router-dom";
import { Row, Col, Label, Button, Form, FormGroup, Input, Alert } from "reactstrap";
import { Context } from "../App";
import ThemeSelector from "./ThemeSelector"

export default function Profile() {
  const {id} = useParams()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
    theme: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [context, setContext] = useContext(Context);
  const updateContext = updates => setContext({
    ...context,
    ...updates
  })

  useEffect(() => {
    if (id === "new") {
      setFormData({ ...formData, username: "", email: "", password: "", passwordCheck: "", theme:""})
      return
    }

    setFormData({ ...formData, ...context.user, passwordCheck: context.user.password, theme: context.user.theme })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const setTheme = (newTheme) => {
  // function setTheme(newTheme) {
    console.log("I setTheme - newTheme:", newTheme);
    setFormData({ ...formData, theme: newTheme })
  }

  async function save(e) {
    e.preventDefault();
    delete formData.passwordCheck

    let result = await (
      await fetch("/api/users/" + (id === "new" ? "" : id), {
        method: (id === "new" ? "POST" : "PUT"),
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

    // On successful registration, login and redirect to calendar view
    if (id === "new") {
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
    } else {
      updateContext(formData);
    }

    // Done, so redirect if new user
    if (id === "new") {
      setFormData({ done: true });
    }
  }

  if (formData.error || formData.done) {
    return <Redirect to="/myCalendar" />;
  }

  let { username, email, password, passwordCheck, theme } = formData;

  if (email === undefined) {
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    })

    if (e.currentTarget.name === "password") {
      setPasswordsMatch(e.currentTarget.value === passwordCheck)
    }
    else if (e.currentTarget.name === "passwordCheck") {
      setPasswordsMatch(password === e.currentTarget.value)
    }
  };

  return (
    <Row className="justify-content-center row mt-3">
      <Col xs="12" lg="6" className="text-center">
        <h1>{ id ==="new" ? 'Registrera' : 'Redigera din profil' }</h1>
        <Alert color="danger" className="my-5"
            isOpen={ showAlert && showAlert !== "" }
            toggle={ () => setShowAlert(false) }>
            { showAlert }
          </Alert>
        <Form
          className="d-inline-flex flex-column w-75 w-lg-100"
          onSubmit={save}
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
              disabled={ id !== "new"}
            ></Input>
          </FormGroup>
         
          <FormGroup>
            <Input
              className="mt-3 p-1"
              type="password"
              value={password}
              name="password"
              placeholder="Lösenord (minst sex tecken)"
              onChange={handleInputChange}
              required
            ></Input>
          </FormGroup>

          <FormGroup>
            <Input
              className="mt-3 p-1"
              type="password"
              value={passwordCheck}
              name="passwordCheck"
              placeholder="Upprepa lösenord"
              onChange={handleInputChange}
              required
            ></Input>
          </FormGroup>

          <FormGroup className={ passwordsMatch ? "d-none" : "d-block" }>
            <Label className="text-danger my-0 py-0">Lösenorden matchar inte!</Label>
          </FormGroup>

          <FormGroup className={ passwordsMatch ? "my-3" : "mt-0" }>
            <ThemeSelector
              theme={theme}
              parentCallback={setTheme} />
          </FormGroup>

          <Col xs="12" className="text-center">
            <Button
              type="submit"
              color="primary"
              className="my-3 w-50"
              disabled={ !passwordsMatch ||password.length < 6 }>
              { id === "new" ? "Registrera" : "Spara"}
            </Button>
          </Col>
          <div className={id === "new" ? "d-block" : "d-none"}>
            <Col xs="12">
            <Link to="/login" className="mt-3">
              Har du redan ett konto?
              <br />
              Logga in
            </Link>
            </Col>
          </div>
        </Form>
      </Col>
    </Row>
  );
}
