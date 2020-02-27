import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";
import { downloadAttendanceFile } from "./utils.js";
import { AttendanceInputMeta } from "./AttendanceInputMeta.jsx";
import { AttendanceInputSave } from "./AttendanceInputSave.jsx";

import { ATTENDANCE_TYPE } from "../attendance/constants.js";

export const AttendanceInputCalendar = ({ td }) => {
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPE.SITTING);
  const [attendance, setAttendance] = useState({});

  const attendanceFilename = `${td.memberCode}.json`;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const {
          data: { attendance }
        } = await axios.get(
          // Shamefully hard-coding the house number and year for now.
          `/data/dail/32/2019/attendance/${attendanceFilename}`
        );

        setAttendance(attendance);
      } catch (error) {
        if (error.response.status === 404) {
          console.warn(`${attendanceFilename} not found.`);
        } else {
          console.error(error);
        }
      }
    };

    fetchAttendance();
  }, [attendanceFilename]);

  const saveAttendance = () => {
    downloadAttendanceFile(attendanceFilename, attendance);
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
        className={classNames({
          "has-background-primary":
            attendance[formattedDate] === ATTENDANCE_TYPE.SITTING,
          "has-background-info":
            attendance[formattedDate] === ATTENDANCE_TYPE.OTHER
        })}
        onClick={toggleAttendanceDate}
      >
        {format(date, "dd")}
      </span>
    );
  };

  return (
    <>
      <AttendanceInputMeta />
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
      <AttendanceInputSave
        filename={attendanceFilename}
        onSave={saveAttendance}
      />
    </>
  );
};
