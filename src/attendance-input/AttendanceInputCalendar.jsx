import React, { useState } from "react";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";

export const AttendanceInputCalendar = () => {
  const [attendanceDates, setAttendanceDates] = useState({});

  const logAttendanceDates = () => {
    console.log(Object.keys(attendanceDates));
  };

  const renderAttendanceInputDate = date => {
    const formattedDate = format(date, "yyyy-MM-dd");

    const toggleAttendanceDate = () => {
      if (attendanceDates[formattedDate]) {
        const {
          [formattedDate]: removedDateKey,
          ...updatedAttendanceDates
        } = attendanceDates;
        setAttendanceDates(updatedAttendanceDates);
      } else {
        setAttendanceDates({
          ...attendanceDates,
          [formattedDate]: formattedDate
        });
      }
    };

    return (
      <span
        className={
          attendanceDates[formattedDate] ? "has-background-grey-light" : null
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
