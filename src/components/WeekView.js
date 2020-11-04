import React, {useState, useEffect, useContext} from "react"
import moment from "moment"
import "moment/locale/sv"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import {Context} from "../App"
import { useMediaQuery } from 'react-responsive'
import {
  Card, CardTitle, CardText,
  CardSubtitle, CardBody, Row, Col, Badge
} from 'reactstrap';
import { Link } from "react-router-dom"
import {dayStyles, getAllRedDays, getSchedule, getOnThisDay, getRandomEvent} from "../functions/CommonCalendarFunctions"

export default function WeekView() {
  //const theme = "grey" //change to context variable
  moment.locale("sv")

  const [calendar, setCalendar] = useState([])
  const [dayValue, setDayValue] = useState(moment())
  const [year, setYear] = useState([])
  const [nameDays, setNameDays] = useState([])
  const [weeklySchedule, setWeeklySchedule] = useState([])
  const [redDays, setRedDays] = useState([])
  let [context, updateContext] = useContext(Context)

  useEffect(() => {
    getYear();
    const startDay = dayValue.clone().startOf("week")
    const endDay = dayValue.clone().endOf("week")
    const day = startDay.clone().subtract(1, "day")
    const weekDays = []
    while (day.isBefore(endDay, "day")) {
      weekDays.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      )
    }
    displaySchedule(dayValue)
    setCalendar(weekDays)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayValue])

  const days = moment.weekdaysShort(true)
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 600px)"
  })

  async function getYear() {
    let year = getCurrentYear()
    let result = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + year)).json()
    let nextYear = +year + 1
    let lastResultDayOfWeek = parseInt(result.dagar[result.dagar.length - 1]["dag i vecka"])
  
    for (let index = 1; lastResultDayOfWeek < 7; index++) {
      let extraResult = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + nextYear + "/" + 1 + "/" + index)).json()
      extraResult.dagar.forEach(dag => {
        result.dagar.push(dag)
      })
      lastResultDayOfWeek = lastResultDayOfWeek + 1
    }

    setYear(result)
    getNamedaysForWeek(result)
    setRedDays(getAllRedDays(result))
  }

  function getNamedaysForWeek(year){
    let data = year.dagar
    let result = data.filter( (day) => 
      parseInt(day.vecka) === parseInt(getCurrentWeek()))
    while (result.length < 7) {
      result.push({ namnsdag: [] })
    }
    if (result.length > 7) {
      result = result.splice(6)
    }
    setNameDays(result)
    getAllEventsForCurrentWeek(result)
  }

  async function getAllEventsForCurrentWeek(currentWeek) {
    let allEventsCurrentMonth = await getSchedule(moment(currentWeek[0].datum), "YYYY-MM")
    let result = []
    let allEventsCurrentWeek = []
    currentWeek.forEach( day => {
      result.push(moment(day.datum))
    })
    
    allEventsCurrentMonth.forEach(event => {
      result.forEach(day => {
          if(event.startDateTime.slice(0, 10) === day.format("YYYY-MM-DD")) {
            allEventsCurrentWeek.push(event)
          }
        })
      })
      setWeeklySchedule(allEventsCurrentWeek)
  }

  function getCurrentYear(){
    return dayValue.format("YYYY")
  }

  function getCurrentWeek() {
    return dayValue.format("ww")
  }

  function getPreviousWeek() {
    return dayValue.clone().subtract(1, "week")
  }

  function getNextWeek() {
    return dayValue.clone().add(1, "week")
  }

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
      <Row className="dateBar mb-2">
        <Col xs="auto"><FontAwesomeIcon className="pointer" size="lg" icon={faArrowAltCircleLeft} onClick={() => setDayValue(getPreviousWeek())} /></Col>
        <Col className="text-center font-weight-bold">Vecka {getCurrentWeek()}</Col>
        <Col xs="auto" className="text-right"><FontAwesomeIcon className="pointer" size="lg" icon={faArrowAltCircleRight} onClick={() => setDayValue(getNextWeek())} /></Col>
      </Row>
      <Row className="d-flex dayBar">
        {
          days.map( day => {
            return <Col className="text-center" key={day}>{isDesktop ? day : day.slice(0, 1)}</Col>   
          })
        }
      </Row>

      <div>
        {
          calendar.map(week => 
            <Row key={week} className="d-flex">
              {
                week.map(day =>
                  <Col key={day} className={`${dayStyles(day, dayValue, redDays)} text-center pointer m-1 layout`} onClick={(e) => { setDayValue(day); displaySchedule(day); }}>
                    <Row className="justify-content-center">
                      <span>
                        {day.format("D")}
                        {!isDesktop && weeklySchedule.filter(event => event.startDateTime.slice(0, 10) === day.format("YYYY-MM-DD")).length > 0 && <div className="eventIndicator"></div>}
                      </span>
                    </Row>
                    { isDesktop &&
                      <Row className="justify-content-center">
                        {
                          nameDays.map(dag => {
                            if (dag.datum === day.format("YYYY-MM-DD")) {
                              return (
                                dag.namnsdag.map(namn => <span key={namn} className="mx-1 text-black">{namn}</span>)
                              )
                            }
                          })
                        }
                      </Row>
                    }
                    { isDesktop &&
                      <Row className="mx-1">
                      {
                        weeklySchedule.filter(event => event.startDateTime.slice(0, 10) === day.format("YYYY-MM-DD")).map(
                          (filteredEvent, index, arr) => {
                            if (index < 2) {
                              return <Badge key={index} className="calbadge" tag={Link} to={`event/${ filteredEvent.id}`} pill color="info" >{filteredEvent.title}</Badge>
                            }
                            if(arr.length > 2 && index === arr.length-1)  return <Badge pill color="dark">+{arr.length-2}</Badge>
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
        <Row className="mt-3 d-flex" style={{height: isDesktop ? "55vh" : "55vh" , overflowY: "scroll"}}>
          {isDesktop ? (
            nameDays.map(day => {
              return (<Col key={day.datum} style={{ maxWidth: "14.285%" }}>
                {weeklySchedule.map(event => {
                  return event.startDateTime.slice(0, 10) === day.datum ? (
                    <Link key={event.id} to={"/event/" + event.id}>
                      <Card className="m-1" inverse color="info">
                        <CardBody className="p-2">
                          <CardTitle className="font-weight-bold">{event.title}</CardTitle>
                          <CardSubtitle>{event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)}</CardSubtitle>
                          <CardText >{event.description}</CardText>
                        </CardBody>
                      </Card>
                    </Link>
                  ) : ""
                }
                )}
              </Col>)
            })) :
            ( context.onThisDay && context.onThisDay.events[+context.randomOnThisDay] && context.onThisDay.events[+context.randomOnThisDay].wikipedia
                 && context.onThisDay.events[+context.randomOnThisDay].wikipedia[0].wikipedia &&
              <Col>
                <Col className="w-100">
                  <a href={ context.onThisDay.events[+context.randomOnThisDay].wikipedia[0].wikipedia }>
                    <Card inverse color="success">
                      <CardBody className="p-2">
                        <CardTitle className="font-weight-bold">
                          { context.onThisDay.events[+context.randomOnThisDay].wikipedia[0].title }
                          ,{" "}
                          { context.onThisDay.events[+context.randomOnThisDay].year }
                        </CardTitle>
                        <CardText>
                          { context.onThisDay.events[+context.randomOnThisDay].description }
                        </CardText>
                      </CardBody>
                    </Card>
                  </a>
                </Col>  
                {
                  nameDays.map(day => {
                    if (day.datum === dayValue.format("YYYY-MM-DD")) {
                      return (<Col className="w-100" key={day.datum}>
                        {weeklySchedule.map(event => {
                          return event.startDateTime.slice(0, 10) === day.datum ? (
                            <Link key={event.id} to={"/event/" + event.id}>
                              <Card className="mt-1" inverse color="info">
                                <CardBody className="p-2">
                                  <CardTitle className="font-weight-bold">{event.title}</CardTitle>
                                  <CardSubtitle>{event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)}</CardSubtitle>
                                  <CardText >{event.description}</CardText>
                                </CardBody>
                              </Card>
                            </Link>
                          ) : ""
                        }
                        )}
                      </Col>)
                    }
                  })
                }
              </Col>
            )
          }
        </Row>
      </div>
    </div>
  )
}