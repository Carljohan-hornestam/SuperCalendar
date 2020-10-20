import React from 'react';
import {Row, Col} from 'reactstrap'

export default function Timestamps() {
    
    const n = 24
    return (<div>
      {[...Array(n)].map((e, i) => (
        <Row key={"row"+i}>
          <Col key={"col"+i}><p key={i}>{i}:00</p></Col>
        </Row>
      ))}
    </div>)
}