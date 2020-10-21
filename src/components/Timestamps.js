import React from 'react';
import {Row, Col} from 'reactstrap'

export default function Timestamps() {
    
  const n = 24
  const style = {
    width: "50px",
    height: "50px",
    backgroundColor: "cadetblue"
  }
  return (
    <Col xs="auto">
      {[...Array(n)].map((e, i) => (
        <Col key={"row"+i}>
          {i}
        </Col>
      ))}
    </Col>
  )
}
/**<p style={style} key={i}>
            {i}
          </p> */