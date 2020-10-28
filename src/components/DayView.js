import React, {useContext} from 'react'
import {
  Card, Button, CardImg, CardTitle, CardText, CardColumns,
  CardSubtitle, CardBody, Row, Col
} from 'reactstrap';
import { Context } from "../App"
import {Link} from "react-router-dom"

export default function DayView() {
	let [context, updateContext] = useContext(Context)

  return (context.selectedDay === undefined ? (<Col></Col>) :
		(
			<Col>
				<Row>
					<Col className="d-flex">
						<p className="font-weight-bold">Datum: {context.selectedDay} {context.selectedWeek === undefined ? "" : `Vecka: ${context.selectedWeek}`}</p>
					</Col>
				</Row>
				<Row>
				<Col md="3" style={{columnCount: "auto"}}>
					{
						context.dailySchedule.map(event =>
							<Link to={"/event/" + event.id}>
								<Card className="m-1">
									<CardBody>
										<CardTitle className="font-weight-bold">{event.title}</CardTitle>
										<CardSubtitle>{event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)}</CardSubtitle>
										<CardText>{event.description}</CardText>
									</CardBody>
								</Card>
							</Link>
						)
					}
				</Col>
				</Row>
			</Col>
		)
	)
}
/* {
	context.dailySchedule.map(event =>
		<Row key={event.id}>
			<Col>
				<Link to={"/event/" + event.id}>
					{event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)} {event.title}
				</Link>
			</Col>
		</Row>
	)
} */