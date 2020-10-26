import React from 'react';
import {Row, Col} from 'reactstrap'

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
          <Row key={"row"+i} style={style}>
            <p key={"p" + i} className="my-0 mx-1">{i < 10 ? "0"+i : i}:00</p>
          </Row>
          <Row key={"row15"+i} style={style}><p key={"p15"+i}></p></Row>
          <Row key={"row30"+i} style={style}><p key={"p30"+i}></p></Row>
          <Row key={"row45"+i} style={style}><p key={"p45"+i}></p></Row>
          </div>
      ))}
      </Col>
  )
}
/**<p style={style} key={i}>
            {i}
          </p> */