import React, {useState, useEffect, useContext} from "react"
import moment from "moment"
import "moment/locale/sv"
import {Row, Col} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowAltCircleLeft, faAngleDoubleRight, faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons"
import { Context } from "../App"
import { useMediaQuery } from 'react-responsive'

export default function Calendar() {
    
    moment.locale("sv")

    const [calendar, setCalendar] = useState([])
    const [value, setValue] = useState(moment())
    const [year, setYear] = useState([])
    const [redDays, setRedDays] = useState([])
    let [context, updateContext] = useContext(Context)



    useEffect(() => {
        getDaysInformation()
        const startDay = value.clone().startOf("month").startOf("week")
        const endDay = value.clone().endOf("month").endOf("week")
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
    }, [value])

    
    const days = moment.weekdaysShort(true)

    async function getDaysInformation(){
        let result = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + value.format("YYYY"))).json()
        setYear(result)
        getAllRedDays(result)
      }

    function getAllRedDays(year){
        let data = year.dagar
        let result = data.filter( (day) => {
          if(day["röd dag"] === "Ja"){
            return day
          }
        })
        setRedDays(result)
    }

    function isRedDay(day) {
        return day.day() === 0 || redDays.find( (redDay) => redDay.datum === day.format("YYYY-MM-DD"))
    }

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
        if (isSelected(day)) return "bg-danger text-white"
        if (isRedDay(day)) return "text-danger"
        if (beforeToday(day)) return "text-secondary"
        if (!sameMonth(day)) return "text-secondary"
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

    let setSelectedDay = update => {
        updateContext({selectedDay: update.format("YYYY-MM-DD"), selectedWeek: update.format("w")})
    }

    const isDesktop = useMediaQuery({
        query: "(min-device-width: 600px)"
    })

    return (
        <div className="mt-3">
            <Row className="bg-light">
                <Col xs="auto">
                <FontAwesomeIcon className="mr-2 pointer" icon={faAngleDoubleLeft} onClick={() => setValue(getPreviousYear())} /> 
                    <FontAwesomeIcon className="pointer" icon={faArrowAltCircleLeft} onClick={() => setValue(getPreviousMonth())} />
                </Col>
                <Col className="text-center font-weight-bold">
                    {getCurrentMonth()} {getCurrentYear()} 
                </Col>
                <Col xs="auto" className="text-right pointer">
                    <FontAwesomeIcon icon={faArrowAltCircleRight} onClick={() => setValue(getNextMonth())} />
                    <FontAwesomeIcon className="ml-2 pointer" icon={faAngleDoubleRight} onClick={() => setValue(getNextYear())} /> 
                </Col>
            </Row>
            <Row className="d-flex">
                {
                    days.map( day => {
                        return <Col className="bg-dark text-white text-center" key={day}>{isDesktop ? day : day.slice(0, 1)}</Col>   
                      })
                }
            </Row>
            <div>
                {
                    calendar.map(week => 
                        <Row className="d-flex" key={week}>
                            {
                                week.map(day =>
                                    <Col className="text-center pointer" onClick={(e) => { setValue(day); setSelectedDay(day);}} key={day}>
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