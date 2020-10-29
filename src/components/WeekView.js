import React, {useState, useEffect, useContext} from "react"
import moment from "moment"
import "moment/locale/sv"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import {Context} from "../App"
import { useMediaQuery } from 'react-responsive'
import {
  Card, CardTitle, CardText,
  CardSubtitle, CardBody, Row, Col
} from 'reactstrap';
import { Link } from "react-router-dom"
import DayView from "./DayView"

export default function WeekView() {
  const theme = "grey" //change to context variable
  moment.locale("sv")

  const [calendar, setCalendar] = useState([])
  const [dayValue, setDayValue] = useState(moment())
  const [year, setYear] = useState([])
  const [week, setWeek] = useState([])
  const [weeklySchedule, setWeeklySchedule] = useState([])
  let [context, updateContext] = useContext(Context)
  let randomEvent = 0

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
    getWeek(result)
  }

  function getWeek(year){
    let data = year.dagar
    let result = data.filter( (day) => 
      parseInt(day.vecka) === parseInt(getCurrentWeek()))
    while (result.length < 7) {
      result.push({ namnsdag: [] })
    }
    if (result.length > 7) {
      result = result.splice(6)
    }
    setWeek(result)
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

  function isSelected(day) {
    return dayValue.isSame(day, "day")
  }

  function beforeToday(day) {
    return day.isBefore(new Date(), "day")
  }

  function isToday(day) {
    return day.isSame(new Date(), "day")
  }

  function dayStyles(day) {
    if (isSelected(day)) return "bg-danger text-white"
    if (isToday(day)) return "bg-secondary text-white"
    //if (containsEvents(day)) return "bg-primary"
    if (beforeToday(day)) return "text-secondary"
    return ""
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

  async function getSchedule(day, format){
    return await(await fetch("/api/events/date/" + day.format(format))).json()
  }

  async function displaySchedule(day) {
    updateContext({
      selectedDay: day.format("YYYY-MM-DD"),
      dailySchedule: await getSchedule(day, "YYYY-MM-DD"),
      onThisDay: await getOnThisDay(day), 
      randomOnThisDay: Math.floor(Math.random() * Math.floor(randomEvent))
    })
  }

  /*async function containsEvents(day) {
    console.log("containsEvent day ", day);
    let events = await getSchedule(day)
    console.log("containsEvent events", events);
    return events.length > 0
  }*/

  async function getOnThisDay(day) {
    let manad = day.format("M")
    let dag = day.format("D")
    let result = await (await fetch("https://byabbe.se/on-this-day/" + manad + "/" + dag + "/events.json")).json()
    randomEvent = result.events.length
    return result
  }

  return (
    <div className="mt-3">
      <Row className="row bg-light">
        <Col xs="auto"><FontAwesomeIcon className="pointer" icon={faArrowAltCircleLeft} onClick={() => setDayValue(getPreviousWeek())} /></Col>
        <Col className="text-center font-weight-bold">Vecka {getCurrentWeek()}</Col>
        <Col xs="auto" className="text-right"><FontAwesomeIcon className="pointer" icon={faArrowAltCircleRight} onClick={() => setDayValue(getNextWeek())} /></Col>
      </Row>
      <Row className="d-flex">
        {
          days.map( day => {
            return <Col style={{backgroundColor: `${theme}`}} className="text-white text-center" key={day}>{isDesktop ? day : day.slice(0, 1)}</Col>   
          })
        }
      </Row>
      <div>

        {
          calendar.map(week => 
            <Row key={week} className="d-flex">
              {
                week.map(day =>
                  <Col key={day} className="text-center" onClick={(e) => { !isDesktop &&  setDayValue(day); !isDesktop && displaySchedule(day); }}>
                      <div className={dayStyles(day)}>
                        {day.format("D")}
                      </div>
                    </Col>
                )
              }
            </Row>
          )
        }
        
        <Row className="d-none d-lg-flex"> 
        {
          week.map(dag => 
            <Col key={dag.datum} className="text-center">
              { dag.namnsdag.map(namn => 
                <span key={namn} className="mx-1">
                  {namn}
                </span>
              )}
            </Col>
          )
          } 
        </Row>

        <Row className="mt-3" style={{height: isDesktop ? "65vh" : "55vh" , overflowY: "scroll"}}>
          { isDesktop ? (
            week.map(day => {
              return (<Col key={day.datum}>
                {weeklySchedule.map(event => {
                  
                  return event.startDateTime.slice(0, 10) === day.datum ? (
                      <Link key={event.id} to={"/event/" + event.id}>
                        <Card className="m-1" inverse color="info">
                          <CardBody>
                            <CardTitle className="font-weight-bold">{event.title}</CardTitle>
                            <CardSubtitle>{event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)}</CardSubtitle>
                            <CardText>{event.description}</CardText>
                          </CardBody>
                        </Card>
                      </Link>
                    ) : ""
                  }
                )}
              </Col>)
            })) :  <DayView/>
          }
        </Row>


      </div>
    </div>
  )
}