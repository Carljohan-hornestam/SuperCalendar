import React, { useContext } from 'react'
import DayView from './DayView'
import Timestamps from './Timestamps'
import {Row, Col} from "reactstrap"
import { useMediaQuery } from 'react-responsive'


export default function ContainerView() {

    const isDesktop = useMediaQuery({
        query: "(min-device-width: 600px)"
    })

    return ( 
        <Row className="d-flex mt-3" style={{height: isDesktop ? "65vh" : "60vh" , overflowY: "scroll"}}>
            <Timestamps />
            
            <DayView />
            
        </Row>
        
    )
}