import React, { useState } from "react";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";

const ATTENDANCE_TYPE = {
  SITTING: "SITTING",
  OTHER: "OTHER"
};

export const AttendanceInputCalendar = ({ td }) => {
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPE.SITTING);
  const [attendance, setAttendance] = useState({});

  const logAttendanceDates = () => {
    console.log(td, attendance);
  };

  const handleAttendanceTypeChange = ({ target: { value } }) => {
    setAttendanceType(value);
  };

  const renderAttendanceInputDate = date => {
    const formattedDate = format(date, "yyyy-MM-dd");

    const toggleAttendanceDate = () => {
      if (
        attendance[formattedDate] &&
        attendance[formattedDate] === attendanceType
      ) {
        const {
          [formattedDate]: removedDateKey,
          ...updatedAttendanceDates
        } = attendance;
        setAttendance(updatedAttendanceDates);
      } else {
        setAttendance({
          ...attendance,
          [formattedDate]: attendanceType
        });
      }
    };

    return (
      <span
        className={
          attendance[formattedDate] === ATTENDANCE_TYPE.SITTING
            ? "has-background-primary"
            : attendance[formattedDate] === ATTENDANCE_TYPE.OTHER
            ? "has-background-info"
            : null
        }
        onClick={toggleAttendanceDate}
      >
        {format(date, "dd")}
      </span>
    );
  };

  return (
    <>
      <div className="control has-text-right">
        <label className="radio">
          <input
            type="radio"
            name="attendance-type"
            value={ATTENDANCE_TYPE.SITTING}
            checked={attendanceType === ATTENDANCE_TYPE.SITTING}
            onChange={handleAttendanceTypeChange}
          />
          <span className="has-background-primary">Sitting</span>
        </label>
        <label className="radio">
          <input
            type="radio"
            name="attendance-type"
            value={ATTENDANCE_TYPE.OTHER}
            checked={attendanceType === ATTENDANCE_TYPE.OTHER}
            onChange={handleAttendanceTypeChange}
          />
          <span className="has-background-info">Other</span>
        </label>
      </div>
      <Calendar renderDate={renderAttendanceInputDate} />
      <div className="container has-text-right">
        <button className="button is-primary" onClick={logAttendanceDates}>
          Save
        </button>
      </div>
    </>
  );
};
