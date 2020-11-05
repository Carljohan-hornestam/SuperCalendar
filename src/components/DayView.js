import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardTitle,
  CardText,
  CardSubtitle,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import {Link} from 'react-router-dom'
import { useMediaQuery } from "react-responsive";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Context } from "../App";
import { getSchedule, getOnThisDay, getRandomEvent } from "../functions/CommonCalendarFunctions";

export default function DayView() {
  moment.locale("sv");

  const [calendar, setCalendar] = useState([]);
  const [dayValue, setDayValue] = useState(moment());
  const [nameDay, setNameDay] = useState([]);
  const [dailySchedule, setDailySchedule] = useState([]);
  let [context, updateContext] = useContext(Context);
  let [onThisDay, setOnThisDay] = useState(context.onThisDay)
  let [randomEvent, setRandomEvent] = useState()

  const isDesktop = useMediaQuery({
    query: "(min-device-width: 600px)",
  });

  useEffect(() => {
    getNameday();
    // updateContext({ selectedDay: dayValue.format("YYYY-MM-DD"), dailySchedule : getSchedule(dayValue, "YYYY-MM-DD") });
    //(async () => { await getSchedule(dayValue, "YYYY-MM-DD") })();
    // getCurrentDayEvents();
    const startDay = dayValue;
    const weekDays = [];
    weekDays.push(
      Array(1)
        .fill(0)
        .map(() => startDay)
    );
    (async () => {setOnThisDay(await getOnThisDay(dayValue))})();
    (async () => {setRandomEvent(Math.floor(Math.random() * Math.floor(getRandomEvent())))})();
    getDailySchedule();
    setCalendar(weekDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayValue]);

  function getCurrentDate() {
    return dayValue.format("YYYY-MM-DD");
  }

  function getCurrentDay() {
    return dayValue.format("dddd, D MMMM");
  }

  function getPreviousDay() {
    return dayValue.clone().subtract(1, "day");
  }

  function getNextDay() {
    return dayValue.clone().add(1, "day");
  }

  async function getDailySchedule() {
    let result = await await getSchedule(dayValue, "YYYY-MM-DD");
    setDailySchedule(result);
  }

  async function getNameday() {
    let currentDate = getCurrentDate();
    let date = currentDate.replaceAll("-", "/");
    let result = await (
      await fetch("http://sholiday.faboul.se/dagar/v2.1/" + date)
    ).json();
    setNameDay(result.dagar[0].namnsdag);
  }
  return (
    <div className="mt-3">
      <Row className="row bg-light">
        <Col xs="auto">
          <FontAwesomeIcon
            className="pointer"
            size="lg"
            icon={faArrowAltCircleLeft}
            onClick={() => setDayValue(getPreviousDay())}
          />
        </Col>
        <Col className="text-center font-weight-bold">{getCurrentDay()}</Col>
        <Col xs="auto" className="text-right">
          <FontAwesomeIcon
            className="pointer"
            size="lg"
            icon={faArrowAltCircleRight}
            onClick={() => setDayValue(getNextDay())}
          />
        </Col>
      </Row>
      <div>
        <Row className="mt-2">
          <Col className="text-center">
            {nameDay.map((namn) => {
              return (
                <span key={namn} className={`${context.user && context.user.username === namn && "font-weight-bold"} mx-1 text-black}`}>
                  {namn}
                </span>
              );
            })}
          </Col>
        </Row>
        <Row
          className="d-flex mt-3"
          style={{ height: isDesktop ? "60vh" : "55vh", overflowY: "scroll" }}
        >
          <Col className="mt-3">
            <Row className="justify-content-center">
              <Col md="3" style={{ columnCount: "auto" }}>
                {onThisDay && onThisDay.events[+randomEvent] && onThisDay.events[+randomEvent].wikipedia
                 && onThisDay.events[+randomEvent].wikipedia[0].wikipedia &&
                  <a
                    href={
                      onThisDay.events[+randomEvent]
                        .wikipedia[0].wikipedia
                    }
                  >
                    <Card className="m-1" inverse>
                      <CardBody className="onThisDay">
                        <CardTitle className="font-weight-bold">
                          {
                            onThisDay.events[+randomEvent]
                              .wikipedia[0].title
                          }
                          ,{" "}
                          {
                            onThisDay.events[+randomEvent]
                              .year
                          }
                        </CardTitle>

                        <CardText>
                          {
                            onThisDay.events[+randomEvent]
                              .description
                          }
                        </CardText>
                      </CardBody>
                    </Card>
                  </a>
                }
                {dailySchedule &&
                  dailySchedule.map((event) => (
                    <Link key={event.id} to={"/event/" + event.id}>
                      <Card className="m-1" inverse color="info">
                        <CardBody>
                          <CardTitle className="font-weight-bold">
                            {event.title}
                          </CardTitle>
                          <CardSubtitle>
                            {event.startDateTime.slice(-5)}-
                            {event.endDateTime.slice(-5)}
                          </CardSubtitle>
                          <CardText>{event.description}</CardText>
                        </CardBody>
                      </Card>
                    </Link>
                  ))}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}