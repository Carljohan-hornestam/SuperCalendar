import React, {useState, useEffect} from "react"
import moment from "moment"
import "moment/locale/sv"
import {Row, Col} from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowAltCircleRight, faArrowAltCircleLeft} from "@fortawesome/free-solid-svg-icons"

export default function WeekView() {
  const theme = "black" //change to context variable
  moment.locale("sv")

  const [calendar, setCalendar] = useState([])
  const [value, setValue] = useState(moment())
  const [year, setYear] = useState([])
  const [week, setWeek] = useState([])

  useEffect(() => {
    getYear()
    const startDay = value.clone().startOf("week")
    const endDay = value.clone().endOf("week")
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

  async function getYear(){
    let year = getCurrentYear()
    let result = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + year)).json()
    setYear(result)
    getWeek(result)
  }

  function getWeek(year){
    let data = year.dagar
    let result = data.filter( (day) => {
      if(parseInt(day.vecka) === parseInt(getCurrentWeek())){
        return day
      }
    })
    setWeek(result)
  }

  function isSelected(day) {
    return value.isSame(day, "day")
  }

  function beforeToday(day) {
    return day.isBefore(new Date(), "day")
  }

  function isToday(day) {
    return day.isSame(new Date(), "day")
  }

  function dayStyles(day) {
    if (beforeToday(day)) return "text-secondary"
    if (isSelected(day)) return "bg-danger text-white"
    if (isToday(day)) return "bg-secondary text-white"
    return ""
  }

  function getCurrentYear(){
    return value.format("YYYY")
  }

  function getCurrentWeek() {
    return value.format("ww")
  }

  function getPreviousWeek() {
    return value.clone().subtract(1, "week")
  }

  function getNextWeek() {
    return value.clone().add(1, "week")
  }

  return (
    <div>
      <h2>Calendar</h2>
      <Row className="row bg-light">
        <Col xs="auto"><FontAwesomeIcon size="2x" icon={faArrowAltCircleLeft} onClick={() => setValue(getPreviousWeek())} /></Col>
        <Col className="text-center font-weight-bold">Vecka {getCurrentWeek()}</Col>
        <Col xs="auto" className="text-right"><FontAwesomeIcon size="2x" icon={faArrowAltCircleRight} onClick={() => setValue(getNextWeek())} /></Col>
      </Row>
      <Row className="d-flex">
        {
          days.map( day => {
            return <Col style={{backgroundColor: `${theme}`}} className="text-white text-center" key={day}>{day}</Col>   
          })
        }
      </Row>
      <div>

        {
          calendar.map(week => 
            <Row key={week} className="d-flex">
              {
                week.map(day =>
                    <Col key={day} className="text-center" onClick={() => setValue(day)}>
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
              {dag.namnsdag.map(namn => 
                <span key={namn} className="mx-1">
                  {namn}
                </span>)}
            </Col>
          )
        }
        </Row>

      </div>
    </div>
  )
}