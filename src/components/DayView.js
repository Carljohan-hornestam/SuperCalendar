import React, {useContext} from 'react'
import {Col, Row} from "reactstrap"
import {Context} from "../App"

export default function DayView() {
	let [context, updateContext] = useContext(Context)

	console.log("selectedDay, dayview: ", context);
  return (context.selectedDay === undefined ? (<Col></Col>) :
		(<Col className="d-flex">
			<p className="font-weight-bold">Datum: {context.selectedDay} {context.selectedWeek === undefined ? "" : `Vecka: ${context.selectedWeek}`}</p>
		</Col>)
  )
}