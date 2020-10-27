import DateTimePicker from "./DateTimePicker";
import React, { useState } from "react";

export default function Test() {
  const [startDateTime, setStartDateTime] = useState({datum: "2020-10-30", tid: "11:20"});

  let { snurrefnutt } = startDateTime;

  function callBackFun(msg) {
      console.log("msg:", msg);
      setStartDateTime({...msg})
  }

  return (
    <div>
      <DateTimePicker
        name="startDateTime"
        header="Startdatum och -tid"
        parentCallBack={callBackFun}
      />{" "}
      <h4>VÄRDE {snurrefnutt.datum}, {snurrefnutt.tid}</h4>
    </div>
  );
}
