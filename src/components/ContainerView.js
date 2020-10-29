import React, { useState, useEffect, useContext } from "react"
import DayView from './DayView'
import Timestamps from './Timestamps'
import {Row, Col} from "reactstrap"
import { useMediaQuery } from 'react-responsive'
import moment from "moment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import {Context} from "../App"

export default function ContainerView() {
  moment.locale("sv")

  const [calendar, setCalendar] = useState([])
  const [dayValue, setDayValue] = useState(moment())
  const [nameDay, setNameDay] = useState([])
  let [context, updateContext] = useContext(Context)

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 600px)"
  })

  useEffect(() => {
    getNameday()
    updateContext({selectedDay: dayValue.format("YYYY-MM-DD")})
    const startDay = dayValue
    const weekDays = []
    weekDays.push(
      Array(1)
        .fill(0)
        .map(() => startDay)
    )
    setCalendar(weekDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayValue])

  const days = moment.weekdays(true)

  function getCurrentDate(){
    return dayValue.format("YYYY-MM-DD")
  }

  function getCurrentDay() {
    return dayValue.format("dddd, D MMMM")
  }

  function getPreviousDay() {
    return dayValue.clone().subtract(1, "day")
  }

  function getNextDay() {
    return dayValue.clone().add(1, "day")
  }

  async function getNameday() {
    let currentDate = getCurrentDate()
    let date = currentDate.replaceAll("-", "/")
    let result = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + date)).json()
    setNameDay(result.dagar[0].namnsdag)
  }
  return (
    <div className="mt-3">
      <Row className="row bg-light">
        <Col xs="auto"><FontAwesomeIcon className="pointer" icon={faArrowAltCircleLeft} onClick={() => setDayValue(getPreviousDay())} /></Col>
        <Col className="text-center font-weight-bold">{getCurrentDay()}</Col>
        <Col xs="auto" className="text-right"><FontAwesomeIcon className="pointer" icon={faArrowAltCircleRight} onClick={() => setDayValue(getNextDay())} /></Col>
      </Row>
      <div>
        
      <Row className="mt-2"> 
        <Col className="text-center">
            {
              nameDay.map(namn => {
                return (<span key={namn} className="mx-1">
                  {namn}
                </span>)
              })
            }   
        </Col>
      </Row>
      <Row className="d-flex mt-3" style={{height: isDesktop ? "60vh" : "55vh" , overflowY: "scroll"}}>
        <DayView />
      </Row>
    </div>
  </div>    
  )
}
//<Timestamps />