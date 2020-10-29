import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";

export default function DateTimePicker(props) {
  const [dTPFormData, setdTPFormData] = useState({
    datum: '',
    tid: '',
  });

  useEffect(() => {
    setdTPFormData({...props.datetime});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => { 
    setdTPFormData({ ...dTPFormData, [e.currentTarget.name]: e.currentTarget.value })
    // console.log('Hej i handleInputChange..... name:', e.currentTarget.name, ', value:', e.currentTarget.value, ', dTPFormData', dTPFormData);
    if (e.currentTarget.name === 'datum') {
      props.parentCallBack({ datum: e.currentTarget.value, tid: dTPFormData.tid })
    } else {    
      props.parentCallBack({ datum: dTPFormData.datum, tid: e.currentTarget.value })
    }
  }
  
  // const handleInputChange = (e) => {
  //   setdTPFormData({
  //     ...dTPFormData,
  //     [e.currentTarget.name]: e.currentTarget.value,
  //   });

  //   props.parentCallBack({...dTPFormData})
  //   // setdTPFormData({...dTPFormData, doUpdate: true})
  // };

  // if (dTPFormData.doUpdate) {
  //   const dateTime = new Date(dTPFormData.datum + ", " + dTPFormData.tid);
  //   console.log("dateTime: ", dateTime.toLocaleString());
  //   props.parentCallBack({datum : dateTime.toLocaleString()})
  //   delete dTPFormData.doUpdate 
  // }

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
              className="form-control"
              type="date"
              name="datum"
              value={dTPFormData.datum}
              onChange={handleInputChange}
              disabled={props.disabled}
            />
          </FormGroup>
        </Col>
        <Col xs="6">
          <FormGroup>
            <Input
              className="form-control"
              type="time"
              name="tid"
              list="times"
              value={dTPFormData.tid}
              onChange={handleInputChange}
              disabled={props.disabled}
            />
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
