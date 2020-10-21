import React from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import ContainerView from './ContainerView';
import {Container} from "reactstrap"

export default function Calendar() {
    return (
        <Container>
            <WeekView />
            <ContainerView />
        </Container>)
}