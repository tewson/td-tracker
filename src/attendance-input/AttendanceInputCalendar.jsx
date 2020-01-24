import React, { useEffect, useState } from "react";
import axios from "axios";
import classNames from "classnames";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";
import { AttendanceInputMeta } from "./AttendanceInputMeta.jsx";
import { AttendanceInputSave } from "./AttendanceInputSave.jsx";

import { ATTENDANCE_TYPE } from "../attendance/constants.js";
import {
  DEFAULT_ATTENDANCE_SOURCE_URL,
  DEFAULT_ATTENDANCE_RECORD_DATE
} from "./constants";

export const AttendanceInputCalendar = ({ td }) => {
  const [attendanceType, setAttendanceType] = useState(ATTENDANCE_TYPE.SITTING);
  const [attendance, setAttendance] = useState({});

  const attendanceFilename = `${td.memberCode}.json`;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const {
          data: { attendance }
        } = await axios.get(`/data/${attendanceFilename}`);

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
    const attendanceFileContent = JSON.stringify({
      source: DEFAULT_ATTENDANCE_SOURCE_URL,
      recordDate: DEFAULT_ATTENDANCE_RECORD_DATE,
      attendance
    });
    const attendanceFileBlob = new Blob([attendanceFileContent], {
      type: "application/json"
    });
    const attendanceFileUrl = URL.createObjectURL(attendanceFileBlob);
    var a = document.createElement("a");
    a.download = attendanceFilename;
    a.href = attendanceFileUrl;
    a.click();
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
