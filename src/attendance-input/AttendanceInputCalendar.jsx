import React, { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";

import { Calendar } from "../calendar/Calendar.jsx";

const ATTENDANCE_TYPE = {
  SITTING: "SITTING",
  OTHER: "OTHER"
};

const ATTENDANCE_SOURCE_URL =
  "https://data.oireachtas.ie/ie/oireachtas/members/recordAttendanceForTaa/2019/2019-11-01_deputies-verification-of-attendance-for-the-payment-of-taa-1-jan-to-30-sep-2019_en.pdf";

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
  }, [td]);

  const saveAttendance = () => {
    const attendanceFileContent = JSON.stringify({
      source: ATTENDANCE_SOURCE_URL,
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
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Source</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <input
                className="input is-primary"
                type="text"
                value={ATTENDANCE_SOURCE_URL}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <Calendar renderDate={renderAttendanceInputDate} />
      <div className="container has-text-right">
        {attendanceFilename}
        <button className="button is-primary" onClick={saveAttendance}>
          Save
        </button>
      </div>
    </>
  );
};
