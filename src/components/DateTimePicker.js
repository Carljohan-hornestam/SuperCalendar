import React, { useState } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";

export default function DateTimePicker(props) {


  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString(),
    time: "08:00",
  });
  
  const handleInputChange = (e) =>
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
    });


  return (
    <>
      <datalist id="times">
        <option value="00:00" />
        <option value="00:30" />
        <option value="01:00" />
        <option value="01:30" />
        <option value="02:00" />
        <option value="02:30" />
        <option value="03:00" />
        <option value="03:30" />
        <option value="04:00" />
        <option value="04:30" />
        <option value="05:00" />
        <option value="05:30" />
        <option value="06:00" />
        <option value="06:30" />
        <option value="07:00" />
        <option value="07:30" />
        <option value="08:00" />
        <option value="08:30" />
        <option value="09:00" />
        <option value="09:30" />
        <option value="10:00" />
        <option value="10:30" />
        <option value="11:00" />
        <option value="11:30" />
        <option value="12:00" />
        <option value="12:30" />
        <option value="13:00" />
        <option value="13:30" />
      </datalist>
      <Row form>
        <Col className="pl-1">
          <Label>{props.header}</Label>
        </Col>
      </Row>
      <Row form>
        <Col xs="6" className="pl-1">
          <FormGroup>
            <Input
              type="date"
              name="date"
              id="exampleDate"
              value={formData.date}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
        <Col xs="6">
          <FormGroup>
            <Input
              type="time"
              name="time"
              id="exampleTime"
              list="times"
              value={formData.time}
              onChange={handleInputChange}
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
