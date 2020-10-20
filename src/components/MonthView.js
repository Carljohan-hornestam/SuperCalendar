import React, {useState, useEffect} from "react"
import moment from "moment"
import "moment/locale/sv"
import {Row, Col} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowAltCircleRight, faArrowAltCircleLeft, faArrowAltCircleUp, faArrowAltCircleDown} from "@fortawesome/free-solid-svg-icons"

export default function Calendar() {
    
    moment.locale("sv")

    const [calendar, setCalendar] = useState([])
    const [value, setValue] = useState(moment())

    const startDay = value.clone().startOf("month").startOf("week")
    const endDay = value.clone().endOf("month").endOf("week")

    useEffect(() => {
        const day = startDay.clone().subtract(1, "day")
        const a = []
        while(day.isBefore(endDay, "day")) {
            a.push(
                Array(7)
                    .fill(0)
                    .map(() => day.add(1, "day").clone())
            )
        }
        setCalendar(a)
        console.log(a);
    }, [value])

    
    const days = moment.weekdaysShort(true)
    const months = moment.months(true)
    /*var check = moment(moment().toDate(), 'YYYY/MM/DD');
    var month = check.format('MMMM');
    var day   = check.format('D');
    var year  = check.format('YYYY');*/

    function isSelected(day) {
        return value.isSame(day, "day")
    }

    function beforeToday(day) {
        return day.isBefore(new Date(), "day")
    }

    function sameMonth(day) {
        return day.isSame(value, "month")
    }

    function isToday(day) {
        return day.isSame(new Date(), "day")
    }

    function dayStyles(day) {
        if (beforeToday(day)) return "text-secondary"
        if (!sameMonth(day)) return "text-secondary"
        if (isSelected(day)) return "bg-danger text-white"
        if (isToday(day)) return "bg-secondary text-white"
        return ""
    }

    function getCurrentMonth() {
        return value.format("MMMM")
    }

    function getPreviousMonth() {
        return value.clone().subtract(1, "month")
    }

    function getNextMonth() {
        return value.clone().add(1, "month")
    }

    function getCurrentYear() {
        return value.format("YYYY")
    }

    function getPreviousYear() {
        return value.clone().subtract(1, "year")
    }

    function getNextYear() {
        return value.clone().add(1, "year")
    }

    return (
        <div>
            <h2>Calendar</h2>
            <Row className="bg-light">
                <Col xs="auto"><FontAwesomeIcon icon={faArrowAltCircleLeft} onClick={() => setValue(getPreviousMonth())} /></Col>
                <Col className="text-center">
                    {getCurrentMonth()} {getCurrentYear()} <FontAwesomeIcon icon={faArrowAltCircleUp} onClick={() => setValue(getNextYear())} /> <FontAwesomeIcon icon={faArrowAltCircleDown} onClick={() => setValue(getPreviousYear())} />
                </Col>
                <Col xs="auto" className="text-right"><FontAwesomeIcon icon={faArrowAltCircleRight} onClick={() => setValue(getNextMonth())} /></Col>
            </Row>
            <Row className="d-flex">
            <Col></Col>
                {
                    days.map( day => {
                        return <Col className="bg-dark text-white text-center" key={day}>{day}</Col>   
                      })
                }
            </Row>
            <div>
                {
                    calendar.map(week => 
                        <Row className="d-flex">
                            <Col size="auto" className="bg-dark text-white">{moment(week[0]).format("w")}</Col>
                            {
                                week.map(day =>
                                    <Col className="text-center" onClick={() => setValue(day)}>
                                        <div className={dayStyles(day)}>
                                            {day.format("D")}
                                        </div>
                                    </Col>
                                    )
                            }
                        </Row>
                    )}

            </div>
        </div>
    )
}