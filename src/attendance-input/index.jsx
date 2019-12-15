import React, { useState } from "react";
import ReactDOM from "react-dom";

import { TDSelector } from "../td-selector/TDSelector.jsx";
import { AttendanceInputCalendar } from "./AttendanceInputCalendar.jsx";

const AttendanceInput = () => {
  const [selectedTD, setSelectedTD] = useState();

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">TD Attendance Input</h1>
        <TDSelector onSelect={setSelectedTD} />
        {selectedTD && <AttendanceInputCalendar td={selectedTD} />}
      </div>
    </section>
  );
};

ReactDOM.render(<AttendanceInput />, document.getElementById("app"));
