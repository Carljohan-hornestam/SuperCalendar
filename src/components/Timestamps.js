import React from 'react';
import {Row, Col} from 'reactstrap'
import DayView from './DayView';

export default function Timestamps() {
  const style = {
    border: "1px solid grey",
  }
  const n = 24
  return (
    
    <Col xs="auto" className="text-right">
    <Row><p className="font-weight-bold">Tid:</p></Row>
      {[...Array(n)].map((e, i) => (
          <div key={"divcontainer" + i}>
          <Row key={i+":00"} style={style}>
            <p key={"p" + i} className="my-0 mx-1">{i < 10 ? "0"+i : i}:00</p>
          </Row>
          <Row key={i+":15"} style={style}><p key={"p15"+i}></p></Row>
          <Row key={i+":30"} style={style}><p key={"p30"+i}></p></Row>
          <Row key={i+":45"} style={style}><p key={"p45"+i}></p></Row>
          </div>
      ))}
      </Col>
  )
}