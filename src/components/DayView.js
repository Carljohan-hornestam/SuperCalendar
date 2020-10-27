import React, {useContext} from 'react'
import {Col, Row} from "reactstrap"
import {Context} from "../App"

export default function DayView() {
	let [context, updateContext] = useContext(Context)

  return (context.selectedDay === undefined ? (<Col></Col>) :
		(<Col>
			<Row>
				<Col className="d-flex">
					<p className="font-weight-bold">Datum: {context.selectedDay} {context.selectedWeek === undefined ? "" : `Vecka: ${context.selectedWeek}`}</p>
				</Col>
			</Row>
			{
                context.dailySchedule.map(event =>
                    <Row key={event.id}>
                      <Col>
                        {event.startDateTime.slice(-5)}-{event.endDateTime.slice(-5)} {event.title}
                      </Col>
                    </Row>
                )
              }
		</Col>)
  )
}