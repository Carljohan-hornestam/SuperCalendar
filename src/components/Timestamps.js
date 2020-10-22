import React from 'react';
import {Row, Col} from 'reactstrap'

export default function Timestamps() {
    
  const n = 24
  return (
    
    <Col xs="auto" className="text-right">
    <Row><p className="font-weight-bold">Tid:</p></Row>
        {[...Array(n)].map((e, i) => (
          <Row key={"row"+i}>
            <p className="font-weight-bold text-center">{i}</p>
          </Row>
      ))}
      </Col>
  )
}
/**<p style={style} key={i}>
            {i}
          </p> */