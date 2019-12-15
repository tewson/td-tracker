import React, { useState } from "react";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";

const ATTENDANCE_TYPE = {
  SITTING: "SITTING",
  OTHER: "OTHER"
};

export const AttendanceInputCalendar = () => {
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPE.SITTING);
  const [attendance, setAttendance] = useState({});

  const logAttendanceDates = () => {
    console.log(Object.keys(attendance));
  };

  const handleAttendanceTypeChange = ({ target: { value } }) => {
    setAttendanceType(value);
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
      <div className="control has-text-right">
        <label className="radio">
          <input
            type="radio"
            name="attendance-type"
            value={ATTENDANCE_TYPE.SITTING}
            checked={attendanceType === ATTENDANCE_TYPE.SITTING}
            onChange={handleAttendanceTypeChange}
          />
          Sitting
        </label>
        <label className="radio">
          <input
            type="radio"
            name="attendance-type"
            value={ATTENDANCE_TYPE.OTHER}
            checked={attendanceType === ATTENDANCE_TYPE.OTHER}
            onChange={handleAttendanceTypeChange}
          />
          Other
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
