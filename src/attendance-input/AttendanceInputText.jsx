import React, { useEffect, useState } from "react";
import axios from "axios";
import compareAsc from "date-fns/compareAsc";
import format from "date-fns/format";
import parse from "date-fns/parse";

import { ATTENDANCE_TYPE } from "../attendance/constants.js";
import {
  DEFAULT_ATTENDANCE_SOURCE_URL,
  DEFAULT_ATTENDANCE_RECORD_DATE
} from "./constants";

import { AttendanceInputSave } from "./AttendanceInputSave.jsx";

const hasInvalidDate = dates => {
  console.log(dates.some(date => !/^\d{2}\/\d{2}\/2019$/.test(date)));
  return dates.some(date => !/^\d{2}\/\d{2}\/2019$/.test(date));
};

const getAttendanceDatesByType = (attendance, type) => {
  const baseDate = new Date();

  return Object.keys(attendance)
    .filter(dateString => attendance[dateString] === type)
    .map(dateString => parse(dateString, "yyyy-MM-dd", baseDate))
    .sort((a, b) => compareAsc(a, b))
    .map(date => format(date, "dd/MM/yyyy"))
    .join("\n");
};

const getAttendanceFromDateStrings = (dateStrings, type) => {
  return dateStrings
    .map(dateString =>
      convertDateFormat(dateString, "dd/MM/yyyy", "yyyy-MM-dd")
    )
    .reduce((acc, date) => {
      return {
        ...acc,
        [date]: type
      };
    }, {});
};

const convertDateFormat = (date, initialFormat, targetFormat) => {
  const baseDate = new Date();

  return format(parse(date, initialFormat, baseDate), targetFormat);
};

const AttendanceDateCount = ({ textareaContent }) => (
  <p>
    Sub-total: {textareaContent ? textareaContent.split("\n").length : 0} day(s)
  </p>
);

export const AttendanceInputText = ({ td }) => {
  const [sittingDaysInput, setSittingDaysInput] = useState("");
  const [nonSittingDaysInput, setNonSittingDaysInput] = useState("");

  const attendanceFilename = `${td.memberCode}.json`;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const {
          data: { attendance }
        } = await axios.get(`/data/${attendanceFilename}`);

        const sittingDaysInputFromFile = getAttendanceDatesByType(
          attendance,
          ATTENDANCE_TYPE.SITTING
        );

        const nonSittingDaysInputFromFile = getAttendanceDatesByType(
          attendance,
          ATTENDANCE_TYPE.OTHER
        );

        setSittingDaysInput(sittingDaysInputFromFile);
        setNonSittingDaysInput(nonSittingDaysInputFromFile);
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

  const handleSittingDaysInputChange = ({ target: { value } }) => {
    setSittingDaysInput(value);
  };

  const handleNonSittingDaysInputChange = ({ target: { value } }) => {
    setNonSittingDaysInput(value);
  };

  const saveAttendance = () => {
    const sittingDays = sittingDaysInput ? sittingDaysInput.split("\n") : [];
    const nonSittingDays = nonSittingDaysInput
      ? nonSittingDaysInput.split("\n")
      : [];

    if (!hasInvalidDate(sittingDays) && !hasInvalidDate(nonSittingDays)) {
      const sittingDayAttendance = getAttendanceFromDateStrings(
        sittingDays,
        ATTENDANCE_TYPE.SITTING
      );
      const nonSittingDayAttendance = getAttendanceFromDateStrings(
        nonSittingDays,
        ATTENDANCE_TYPE.OTHER
      );

      const attendance = {
        ...sittingDayAttendance,
        ...nonSittingDayAttendance
      };

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
    } else {
      alert("Invalid input");
    }
  };

  return (
    <>
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
                value={DEFAULT_ATTENDANCE_SOURCE_URL}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label">Record date</label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              <input
                className="input is-primary"
                type="text"
                value={DEFAULT_ATTENDANCE_RECORD_DATE}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <label class="label">Sitting days</label>
          <textarea
            className="textarea"
            rows="20"
            value={sittingDaysInput}
            onChange={handleSittingDaysInputChange}
          />
          <AttendanceDateCount textareaContent={sittingDaysInput} />
        </div>
        <div className="column">
          <label class="label">Non-sitting days</label>
          <textarea
            className="textarea"
            rows="20"
            value={nonSittingDaysInput}
            onChange={handleNonSittingDaysInputChange}
          />
          <AttendanceDateCount textareaContent={nonSittingDaysInput} />
        </div>
      </div>
      <AttendanceInputSave
        filename={attendanceFilename}
        onSave={saveAttendance}
      />
    </>
  );
};
