import React from "react";

export default function Person(props) {
  return (
    <div className="card">
      <div className="card-body col-12">
        <p className="card-text">{props.firstName} {props.lastName}</p>
      </div>
    </div>
  );
}
