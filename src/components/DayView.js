import React, {useContext, useEffect} from 'react'
import {
  Card, CardTitle, CardText,
  CardSubtitle, CardBody, Row, Col
} from 'reactstrap';
import { Context } from "../App"
import {Link} from "react-router-dom"

export default function DayView() {
	let [context, updateContext] = useContext(Context)

	function getRandomInt() {
		context.onThisDay === undefined ? updateContext({ randomOnThisDay: 0 }) :
			updateContext({ randomOnThisDay: Math.floor(Math.random() * Math.floor(context.onThisDay.events.length)) })
	}

	useEffect(() => {
		getRandomInt()
	}, [])

  return (context.selectedDay === undefined ? (<Col></Col>) :
		(
			<Col>
				<Row>
					<Col className="d-flex">
						<p className="font-weight-bold">Datum: {context.selectedDay} {context.selectedWeek === undefined ? "" : `Vecka: ${context.selectedWeek}`}</p>
					</Col>
				</Row>
				<Row>
					<Col md="3" style={{ columnCount: "auto" }}>
						{context.onThisDay === undefined ? "" : <a href={context.onThisDay.events[+context.randomOnThisDay].wikipedia[0].wikipedia}>
							<Card className="m-1" inverse color="success">
								<CardBody>
									<CardTitle className="font-weight-bold">{context.onThisDay.events[+context.randomOnThisDay].wikipedia[0].title}, {context.onThisDay.events[+context.randomOnThisDay].year}</CardTitle>
									
									<CardText>{context.onThisDay.events[+context.randomOnThisDay].description}</CardText>
								</CardBody>
							</Card>
						</a>}
					{
						context.dailySchedule !== undefined ? context.dailySchedule.map(event =>
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
				</Col>
				</Row>
			</Col>
		)
	)
}
/* 
SAKNAR DU NÅGOT? KOLLA HÄR!
{
	context.dailySchedule.map(event =>
		<Row key={event.id}>
			<Col>
				<Link to={"/event/" + event.id}>
					{event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)} {event.title}
				</Link>
			</Col>
		</Row>
	)
} 

style={{maxHeight: "150px", overflowY: "scroll" }}
*/