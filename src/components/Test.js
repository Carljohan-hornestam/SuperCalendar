import DateTimePicker from "./DateTimePicker";
import React, { useState } from "react";

export default function Test() {
  const [startDateTime, setStartDateTime] = useState({datum: "2020-11-28", tid: "10:00"});

  // function callBackFun(msg) {
  //   console.log("i callback - msg:", msg);
  //   setStartDateTime({...msg})
  // }

  return (
    <div>
      <DateTimePicker
        name="startDateTime"
        header="Startdatum och -tid"
        parentCallBack={setStartDateTime}
        datetime={startDateTime}
      />{" "}
      <h4>VÄRDE { startDateTime.datum }, { startDateTime.tid }</h4>
    </div>
  );
}
