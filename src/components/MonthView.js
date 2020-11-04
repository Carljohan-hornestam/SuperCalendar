import React, {useState, useEffect, useContext} from "react"
import moment from "moment"
import "moment/locale/sv"
import { Row, Col, Badge } from 'reactstrap'
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowAltCircleLeft, faAngleDoubleRight, faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons"
import { Context } from "../App"
import { useMediaQuery } from 'react-responsive'
import {dayStyles, getAllRedDays, getSchedule, getOnThisDay, getRandomEvent} from "../functions/CommonCalendarFunctions"

export default function Calendar() {
    
  moment.locale("sv")

  const [calendar, setCalendar] = useState([])
  const [dayValue, setDayValue] = useState(moment())
  const [year, setYear] = useState([])
  const [redDays, setRedDays] = useState([])
  let [context, updateContext] = useContext(Context)
  const [monthlySchedule, setMonthlySchedule] = useState([])

  useEffect(() => {
    getDaysInformation()
    const startDay = dayValue.clone().startOf("month").startOf("week")
    const endDay = dayValue.clone().endOf("month").endOf("week")
    const day = startDay.clone().subtract(1, "day")
    const monthDays = []
    while(day.isBefore(endDay, "day")) {
      monthDays.push(
        Array(7)
        .fill(0)
        .map(() => day.add(1, "day").clone())
      )
    }
    getMonthlySchedule();
    setCalendar(monthDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayValue])

  const days = moment.weekdays(true)

  async function getMonthlySchedule() {
    let result = await (await getSchedule(dayValue, "YYYY-MM"))
    setMonthlySchedule(result)
  }

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
          <FontAwesomeIcon className="mr-2 pointer" size="lg" icon={faAngleDoubleLeft} onClick={() => setDayValue(getPreviousYear())} /> 
          <FontAwesomeIcon className="pointer" size="lg" icon={faArrowAltCircleLeft} onClick={() => setDayValue(getPreviousMonth())} />
        </Col>
        <Col className="text-center font-weight-bold">
            {getCurrentMonth()} {getCurrentYear()} 
        </Col>
        <Col xs="auto" className="text-right pointer">
          <FontAwesomeIcon icon={faArrowAltCircleRight} size="lg" onClick={() => setDayValue(getNextMonth())} />
          <FontAwesomeIcon className="ml-2 pointer" size="lg" icon={faAngleDoubleRight} onClick={() => setDayValue(getNextYear())} /> 
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
                  <Col className={`${dayStyles(day, dayValue, redDays)} text-center pointer m-lg-1 layout`} onClick={(e) => { setDayValue(day); displaySchedule(day);}} key={day}>
                    {day.format("D")}
                    { isDesktop &&
                      <Row className="mx-1">
                      {
                        monthlySchedule.filter(event => event.startDateTime.slice(0, 10) === day.format("YYYY-MM-DD")).map(
                          (filteredEvent, index, arr) => {
                            if (index < 2) {
                              return <Badge key={index} className="calbadge" tag={Link} to={`event/${ filteredEvent.id}`} pill color="info" >{filteredEvent.title}</Badge>
                            }
                            if(arr.length > 2 && index === arr.length-1)  return <Badge key={arr.length} pill color="dark">+{arr.length-2}</Badge>
                          }
                        )
                      }
                      </Row>
                    }
                  </Col>

                )
              }
            </Row>
          )
        }
      </div>
    </div>
  )
}