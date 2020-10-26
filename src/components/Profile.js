import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {Form, FormGroup, Input, Row, Col} from 'reactstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";
import {Context} from "../App"

export default function Profile() {
    let [context, updateContext] = useContext(Context)

    function handleInputChange(e) {
        console.log(e.currentTarget.value);
    }

    return (
        <Row className="justify-content-center mt-3">
            <Col xs="12" lg="6" className="text-center">
                <h1>Ändra dina uppgifter</h1>
                <Form
                    className="d-inline-flex flex-column w-75 w-lg-100"
                    //onSubmit={} ska skapas!!!
                >
                    <FormGroup>
                        <Input
                            className="mt-3 p-1"
                            type="text"
                            value={context.user.userName}
                            name="username"
                            placeholder="Användarnamn"
                            onChange={handleInputChange}
                            required
                            //en alert om användarnamnet finns ska skapas!!!
                        ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Input
                            className="mt-3 p-1"
                            type="email"
                            value={context.user.email}
                            name="email"
                            placeholder="Epost"
                            onChange={handleInputChange}
                            required
                        ></Input>
                    </FormGroup>
                    {/*<FormGroup>
                        <Input
                            className="mt-3 p-1"
                            type="password"
                            value={currentPassword}
                            name="currentPassword"
                            placeholder="Nuvarande lösenord"
                            onChange={handleInputChange}
                            required
                        ></Input>
                    </FormGroup>
                    <FormGroup>
                        <Input
                            className="mt-3 p-1"
                            type="password"
                            value={newPassword}
                            name="newPassword"
                            placeholder="Nytt lösenord"
                            onChange={handleInputChange}
                            required
                        ></Input>
                    </FormGroup>*/}
                    <Col className="mb-3">
                        <Link to="/mycalendar"><FontAwesomeIcon
                            size="2x"
                            icon={faTimes}
                            className="float-left text-danger"
                        /></Link>
                        <FontAwesomeIcon
                            size="2x"
                            icon={faCheck}
                            className="float-right text-success"
                            //onClick ska skapas!!!
                        />
                    </Col>
                </Form>
            </Col>
        </Row>
    )
}