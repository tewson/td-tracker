import React, { useState } from "react";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";

export const AttendanceInputCalendar = () => {
  const [attendance, setAttendance] = useState({});

  const logAttendanceDates = () => {
    console.log(Object.keys(attendance));
  };

  const renderAttendanceInputDate = date => {
    const formattedDate = format(date, "yyyy-MM-dd");

    const toggleAttendanceDate = () => {
      if (attendance[formattedDate]) {
        const {
          [formattedDate]: removedDateKey,
          ...updatedAttendanceDates
        } = attendance;
        setAttendance(updatedAttendanceDates);
      } else {
        setAttendance({
          ...attendance,
          [formattedDate]: formattedDate
        });
      }
    };

    return (
      <span
        className={
          attendance[formattedDate] ? "has-background-grey-light" : null
        }
        onClick={toggleAttendanceDate}
      >
        {format(date, "dd")}
      </span>
    );
  };

  return (
    <>
      <Calendar renderDate={renderAttendanceInputDate} />
      <div className="container has-text-right">
        <button className="button is-primary" onClick={logAttendanceDates}>
          Save
        </button>
      </div>
    </>
  );
};
