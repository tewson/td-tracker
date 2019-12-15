import React, { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";
import isSameMonth from "date-fns/isSameMonth";

import { Calendar } from "./Calendar.jsx";
import { AttendanceTooltip } from "./AttendanceTooltip.jsx";

import "react-popper-tooltip/dist/styles.css";

export const ActivityCalendar = ({ td, activities }) => {
  const [attendance, setAttendance] = useState({});
  useEffect(() => {
    const fetchAttendance = async () => {
      const attendanceFilename = `${td.memberCode}.json`;

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
        setAttendance({});
      }
    };

    fetchAttendance();
  }, [td]);

  const debateDates = activities.debates.reduce((debateDatesAcc, debate) => {
    if (debateDatesAcc[debate.debateRecord.date]) {
      return {
        ...debateDatesAcc,
        [debate.debateRecord.date]: [
          ...debateDatesAcc[debate.debateRecord.date],
          debate
        ]
      };
    }

    return {
      ...debateDatesAcc,
      [debate.debateRecord.date]: [debate]
    };
  }, {});

  const renderDateWithActivityHighlight = (date, firstDateOfMonth) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const shortDate = format(date, "dd");

    if (!isSameMonth(date, firstDateOfMonth)) {
      return <span className="has-text-grey-light">{shortDate}</span>;
    }

    if (debateDates[formattedDate] || attendance[formattedDate]) {
      if (debateDates[formattedDate]) {
        return (
          <span className="has-activity">
            <button className="button is-info">{shortDate}</button>
          </span>
        );
      } else {
        return (
          <AttendanceTooltip
            placement="top"
            trigger="click"
            content={`Attendance type: ${attendance[formattedDate]}`}
          >
            <span className="has-activity">
              <button className="button">{shortDate}</button>
            </span>
          </AttendanceTooltip>
        );
      }
    }

    return shortDate;
  };

  return <Calendar renderDate={renderDateWithActivityHighlight} />;
};
