import React, {useState, useEffect} from "react"
import {Row, Col} from "reactstrap"

export default function WeekDays(){

  const [month, setMonth] = useState([])
  const [week, setWeek] = useState([])
  let weeknumber = 42
  const n = 25

  useEffect(() => {
    setMonth(getMonth(2020, 10))
  }, [])

  async function getMonth(year, month){
    let result = await (await fetch("http://sholiday.faboul.se/dagar/v2.1/" + year + "/" + month)).json()
    await getWeek(result)
    return result
  }

  function getWeek(month){
    let data = month.dagar
    setWeek(data.filter( (day) => {
      if(parseInt(day.vecka) === weeknumber){
        return day
      }
    }))
  }

  return (
    <>
    <Row className="text-center mt-3">
      <Col>
        <span>Vecka {weeknumber}</span>
      </Col>
    </Row>
    <hr/>
    <Row className="text-center">
      <Col xs="12" md={{size: true}}></Col>
      {week.map(dag => {
        return (
            <Col xs="12" md={{size: true}} key={dag["dag i vecka"]}>
              <Col className="font-weight-bold">{dag.veckodag}</Col>
              <Col key={dag.datum}>{dag.namnsdag.map(namn => <span key={namn} className="mx-1">{namn}</span>)}</Col>
            </Col>
        )
      })}
      </Row>
      {[...Array(n)].map((e, i) => (
        <Row key={"row"+i}>
          <Col key={"col"+i} xs="12" md={{size: true}}><p key={i}>{i}:00</p></Col>
        </Row>
      ))}
    </>
  )
}