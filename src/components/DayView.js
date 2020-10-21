import React, {useContext} from 'react'
import {Col} from "reactstrap"
import {Context} from "../App"

export default function DayView() {
	let [context, updateContext] = useContext(Context)

	console.log("selectedDay, dayview: ", context.selectedDay);
  return (
		<Col className="d-flex">
			<p className="font-weight-bold">Datum: {context.selectedDay}</p>
		</Col>

	)
}