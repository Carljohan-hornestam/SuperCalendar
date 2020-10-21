import React from 'react'
import DayView from './DayView'
import Timestamps from './Timestamps'
import {Row} from "reactstrap"
import { useMediaQuery } from 'react-responsive'


export default function ContainerView() {

    const isDesktop = useMediaQuery({
        query: "(min-device-width: 600px)"
    })

    return ( 
        <Row className="d-flex mt-3" style={{height: isDesktop ? "60vh" : "45vh" ,border: "1px solid black", overflowY: "scroll"}}>
            <Timestamps />
            <DayView />
        </Row>
        
    )
}