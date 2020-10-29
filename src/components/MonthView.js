import React, {useState, useEffect, useContext} from "react"
import moment from "moment"
import "moment/locale/sv"
import {Row, Col} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowAltCircleLeft, faAngleDoubleRight, faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons"
import { Context } from "../App"
import { useMediaQuery } from 'react-responsive'
import DayView from "./DayView"
import {dayStyles, getAllRedDays, getSchedule, getOnThisDay, getRandomEvent} from "../functions/CommonCalendarFunctions"

export default function Calendar() {
    
  moment.locale("sv")

  const [calendar, setCalendar] = useState([])
  const [dayValue, setDayValue] = useState(moment())
  const [year, setYear] = useState([])
  const [redDays, setRedDays] = useState([])
  let [context, updateContext] = useContext(Context)

  useEffect(() => {
    getDaysInformation()
    const startDay = dayValue.clone().startOf("month").startOf("week")
    const endDay = dayValue.clone().endOf("month").endOf("week")
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayValue])

  const days = moment.weekdaysShort(true)

  async function getDaysInformation(){
    let result = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + dayValue.format("YYYY"))).json()
    setYear(result)
    setRedDays(getAllRedDays(result))
  }

  function getCurrentMonth() {
    return dayValue.format("MMMM")
  }

  function getPreviousMonth() {
    return dayValue.clone().subtract(1, "month")
  }

  function getNextMonth() {
    return dayValue.clone().add(1, "month")
  }

  function getCurrentYear() {
    return dayValue.format("YYYY")
  }

  function getPreviousYear() {
    return dayValue.clone().subtract(1, "year")
  }

  function getNextYear() {
    return dayValue.clone().add(1, "year")
  }

  /* let setSelectedDay = update => {
    updateContext({selectedDay: update.format("YYYY-MM-DD"), selectedWeek: update.format("w")})
  }
 */
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 600px)"
  })

  async function displaySchedule(day) {
    updateContext({
      selectedDay: day.format("YYYY-MM-DD"),
      dailySchedule: await getSchedule(day, "YYYY-MM-DD"),
      onThisDay: await getOnThisDay(day), 
      randomOnThisDay: Math.floor(Math.random() * Math.floor(getRandomEvent()))
    })
  }

  return (
    <div className="mt-3">
      <Row className="bg-light">
        <Col xs="auto">
          <FontAwesomeIcon className="mr-2 pointer" icon={faAngleDoubleLeft} onClick={() => setDayValue(getPreviousYear())} /> 
          <FontAwesomeIcon className="pointer" icon={faArrowAltCircleLeft} onClick={() => setDayValue(getPreviousMonth())} />
        </Col>
        <Col className="text-center font-weight-bold">
            {getCurrentMonth()} {getCurrentYear()} 
        </Col>
        <Col xs="auto" className="text-right pointer">
          <FontAwesomeIcon icon={faArrowAltCircleRight} onClick={() => setDayValue(getNextMonth())} />
          <FontAwesomeIcon className="ml-2 pointer" icon={faAngleDoubleRight} onClick={() => setDayValue(getNextYear())} /> 
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
                  <Col className="text-center pointer" onClick={(e) => { setDayValue(day); displaySchedule(day);}} key={day}>
                    <div className={dayStyles(day, dayValue, redDays)}>
                      {day.format("D")}
                    </div>
                  </Col>
                )
              }
            </Row>
          )
        }
      </div>
      <Row className="mt-2" style={{height: isDesktop ? "55vh" : "43vh" , overflowY: "scroll"}}>
        <DayView/>
      </Row>
    </div>
  )
}