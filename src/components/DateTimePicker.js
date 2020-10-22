import React from "react";
import {
    Row,
    Col,
    FormGroup,
    Input,
    Label,
  } from "reactstrap";

  export default function DateTimePicker(props) {

    return (
        <>
        <datalist id ="times">
            <option value="00:00"/>
            <option value="00:30"/>
            <option value="01:00"/>
            <option value="01:30"/>
            <option value="02:00"/>
            <option value="02:30"/>
            <option value="03:00"/>
            <option value="03:30"/>
            <option value="04:00"/>
            <option value="04:30"/>
            <option value="05:00"/>
            <option value="05:30"/>
            <option value="06:00"/>
            <option value="06:30"/>
            <option value="07:00"/>
            <option value="07:30"/>
            <option value="08:00"/>
            <option value="08:30"/>
            <option value="09:00"/>
            <option value="09:30"/>
            <option value="10:00"/>
            <option value="10:30"/>
            <option value="11:00"/>
            <option value="11:30"/>
            <option value="12:00"/>
            <option value="12:30"/>
            <option value="13:00"/>
            <option value="13:30"/>
        </datalist>
        <Row>
          <Col className="pl-1">
            <Label>{props.header}</Label>
          </Col>
        </Row>
        <Row>
          <Col xs="6" className="pl-1">
            <FormGroup>
              <Input
                type="date"
                name="date"
                id="exampleDate"
                placeholder="date placeholder"
              />
            </FormGroup>
          </Col>
          <Col xs="6">
            <FormGroup>
              <Input
                type="time"
                name="time"
                id="exampleTime"
                placeholder="time placeholder"
                list="times"
                value="08:00"
              />
            </FormGroup>
          </Col>
        </Row>
        </>
    );
  }