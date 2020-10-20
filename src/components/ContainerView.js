import React from 'react'
import DayView from './DayView'
import Timestamps from './Timestamps'

export default function ContainerView() {
    const style = {
        height: '57vh',
        border: '1px solid black'
    }
    return (
        <div style={style} className="d-flex overflow-auto">
            <Timestamps />
            <DayView />
        </div>
    )
}