import React, { useState, useEffect } from "react";
import { Row, Col, FormGroup, Input, Label } from "reactstrap";

export default function DateTimePicker(props) {
  const [dTPFormData, setdTPFormData] = useState({
    datum: '',
    tid: '',
  });

  useEffect(() => {
    getTimeValues()
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
  
  let timeArr = []
  let str = ""

  function getTimeValues() {
    for(let timmar = 0; timmar < 24; timmar++){
      for (let minuter = 0; minuter <= 45; minuter += 15) {
        let hour = timmar < 10 ? "0" + timmar : timmar
        let min = minuter == 0 ? "0" + minuter : minuter
        timeArr.push(`${hour}:${min}`)
        //let time = `${hour}:${min}`

        //return <option value={`${hour}:${min}`} />
      }
    }
    timeArr.map(x => str += `<option value="${x}">${x}</option>\n`)
    document.getElementById('times').innerHTML = str;
  }

  return (
    <>
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
            list="times"
            className="form-control"
            name="tid"
            type="time"
            value={dTPFormData.tid}
            onChange={handleInputChange}
            disabled={props.disabled}
            />
            <datalist id="times">
        
            </datalist>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
