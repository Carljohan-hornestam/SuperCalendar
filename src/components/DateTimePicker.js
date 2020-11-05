import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";

export default function DateTimePicker(props) {
  const [dTPFormData, setdTPFormData] = useState({
    datum: '',
    tid: '',
  });

  useEffect(() => {
    setdTPFormData({ ...props.datetime });
    createList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => { 
    setdTPFormData({ ...dTPFormData, [e.currentTarget.name]: e.currentTarget.value })
    if (e.currentTarget.name === 'datum') {
      props.parentCallBack({ datum: e.currentTarget.value, tid: dTPFormData.tid })
    } else {    
      props.parentCallBack({ datum: dTPFormData.datum, tid: e.currentTarget.value })
    }
  }

  function createList() {
    document.getElementById('times').innerHTML = ([...Array(24 * 4).keys()].map((value) => {
      let h = ('0' + parseInt(value / 4)).slice(-2)
      let m = ('0' + value % 4 * 15).slice(-2)
      let t = `${h}:${m}`
      return `<option value="${t}" />`
    }).join("\n"))
    // }).join("\n"))
  }

  return (
    <>
      <datalist id="times">
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
        <Col xs="6" className={props.noTime ? 'd-none' : 'd-block'}>
          <FormGroup>
            <Input
              className="form-control"
              type="time"
              name="tid"
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
