import React, { useEffect, useState } from "react";
import axios from "axios";
import { compareAsc, format, parse } from "date-fns";

import { ATTENDANCE_TYPE } from "../attendance/constants.js";

import { downloadAttendanceFile } from "./utils.js";
import { AttendanceInputMeta } from "./AttendanceInputMeta.jsx";
import { AttendanceInputSave } from "./AttendanceInputSave.jsx";

const hasInvalidDate = dates => {
  console.log(dates.some(date => !/^\d{2}\/\d{2}\/2019$/.test(date)));
  return dates.some(date => !/^\d{2}\/\d{2}\/2019$/.test(date));
};

const getAttendanceDatesByType = (attendance, type) => {
  const baseDate = new Date();

  return attendance[type]
    .map(dateString => parse(dateString, "yyyy-MM-dd", baseDate))
    .sort((a, b) => compareAsc(a, b))
    .map(date => format(date, "dd/MM/yyyy"))
    .join("\n");
};

const convertAttendanceDateStrings = dateStrings => {
  return dateStrings.map(dateString =>
    convertDateFormat(dateString, "dd/MM/yyyy", "yyyy-MM-dd")
  );
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
        } = await axios.get(
          // Shamefully hard-coding the house term and year for now.
          `/data/dail/32/2019/attendance/${attendanceFilename}`
        );

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

        setSittingDaysInput("");
        setNonSittingDaysInput("");
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
      const sittingDayAttendance = convertAttendanceDateStrings(sittingDays);
      const nonSittingDayAttendance = convertAttendanceDateStrings(
        nonSittingDays
      );

      const attendance = {
        [ATTENDANCE_TYPE.SITTING]: sittingDayAttendance,
        [ATTENDANCE_TYPE.OTHER]: nonSittingDayAttendance
      };

      downloadAttendanceFile(attendanceFilename, attendance);
    } else {
      alert("Invalid input");
    }
  };

  return (
    <>
      <AttendanceInputMeta />
      <div className="columns">
        <div className="column">
          <label className="label">Sitting days</label>
          <textarea
            className="textarea"
            rows="20"
            value={sittingDaysInput}
            onChange={handleSittingDaysInputChange}
          />
          <AttendanceDateCount textareaContent={sittingDaysInput} />
        </div>
        <div className="column">
          <label className="label">Non-sitting days</label>
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
